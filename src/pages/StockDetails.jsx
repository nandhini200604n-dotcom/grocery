import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/StockDetails.css";

function StockDetails() {

    const API_URL = "http://127.0.0.1:5003";

    const [stockItems, setStockItems] = useState([]);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({

        product_name: "",
        category: "",
        quantity: "",
        price: "",
        import_date: "",
        manufacture_date: "",
        expire_date: "",
        supplier: "",
        batch: ""

    });

    useEffect(() => {

        loadStock();

    }, []);

    async function loadStock() {

        try {

            const response =
                await fetch(`${API_URL}/stockdetails`);

            const data =
                await response.json();

            setStockItems(data);

        }

        catch (error) {

            console.log(error);

        }

    }

    function getExpiryStatus(expireDate) {

        const today = new Date();

        const expDate =
            new Date(expireDate);

        const diff =
            Math.ceil(
                (expDate - today) /
                (1000 * 60 * 60 * 24)
            );

        if (diff < 0)
            return "Expired";

        if (diff <= 30)
            return "Expiring Soon";

        return "Fresh";

    }

    function handleChange(e) {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    }

    async function addStock() {

        if (

            formData.product_name === "" ||

            formData.category === "" ||

            formData.quantity === "" ||

            formData.price === ""

        ) {

            alert("Fill all fields");

            return;

        }

        try {

            const response =
                await fetch(

                    `${API_URL}/stockdetails`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(formData)

                    }

                );

            const result =
                await response.json();

            alert(result.message);

            loadStock();

            clearForm();

        }

        catch (error) {

            console.log(error);

        }

    }

    async function deleteItem(id) {

        if (
            !window.confirm(
                "Delete this item?"
            )
        )
            return;

        await fetch(

            `${API_URL}/stockdetails/${id}`,

            {

                method: "DELETE"

            }

        );

        alert(
            "Stock Item Deleted Successfully"
        );

        loadStock();

    }

    function editItem(item) {

        setFormData(item);

    }

    function clearForm() {

        setFormData({

            product_name: "",
            category: "",
            quantity: "",
            price: "",
            import_date: "",
            manufacture_date: "",
            expire_date: "",
            supplier: "",
            batch: ""

        });

    }

    const filteredItems =
        stockItems.filter(item =>

            item.product_name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

        );

    const totalItems =
        stockItems.length;

    const totalCategories =
        new Set(

            stockItems.map(

                item =>
                    item.category

            )

        ).size;

    const totalSuppliers =
        new Set(

            stockItems.map(

                item =>
                    item.supplier

            )

        ).size;

    const expiringSoon =
        stockItems.filter(

            item =>

                getExpiryStatus(
                    item.expire_date
                ) ===
                "Expiring Soon"

        ).length;
        return (

        <div className="container">

            <Sidebar />

            <div className="main-content">

                {/* Header */}

                <div className="header">

                    <div>

                        <h1>📦 Stock Details</h1>

                        <p>
                            Manage all your stock information
                        </p>

                    </div>

                    <div className="header-actions">

                        <input
                            type="text"
                            placeholder="🔍 Search Stock..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        <button className="search-btn">
                            Search
                        </button>

                    </div>

                </div>

                {/* Cards */}

                <div className="cards">

                    <div className="card total">

                        <h3>Total Items</h3>

                        <h1>{totalItems}</h1>

                    </div>

                    <div className="card category">

                        <h3>Categories</h3>

                        <h1>{totalCategories}</h1>

                    </div>

                    <div className="card supplier">

                        <h3>Suppliers</h3>

                        <h1>{totalSuppliers}</h1>

                    </div>

                    <div className="card expire">

                        <h3>Expiring Soon</h3>

                        <h1>{expiringSoon}</h1>

                    </div>

                    <div className="card updated">

                        <h3>Last Updated</h3>

                        <h1>

                            {new Date().toLocaleDateString()}

                        </h1>

                    </div>

                </div>

                {/* Form */}

                <div className="form-section">

                    <h2>Add New Stock Item</h2>

                    <div className="form-grid">

                        <input
                            type="text"
                            name="product_name"
                            placeholder="Product Name"
                            value={formData.product_name}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                        />

                        <div className="input-group">

                            <label>
                                Import Date
                            </label>

                            <input
                                type="date"
                                name="import_date"
                                value={formData.import_date}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="input-group">

                            <label>
                                Manufacture Date
                            </label>

                            <input
                                type="date"
                                name="manufacture_date"
                                value={formData.manufacture_date}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="input-group">

                            <label>
                                Expire Date
                            </label>

                            <input
                                type="date"
                                name="expire_date"
                                value={formData.expire_date}
                                onChange={handleChange}
                            />

                        </div>

                        <input
                            type="text"
                            name="supplier"
                            placeholder="Supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="batch"
                            placeholder="Batch Number"
                            value={formData.batch}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-buttons">

                        <button
                            className="add-stock-btn"
                            onClick={addStock}
                        >
                            ➕ Add Item
                        </button>

                        <button
                            className="clear-btn"
                            onClick={clearForm}
                        >
                            🔄 Clear
                        </button>

                    </div>

                </div>
                                {/* Stock Items Table */}

                <div className="table-section">

                    <h2>Stock Items List</h2>

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Import Date</th>
                                <th>Manufacture Date</th>
                                <th>Expire Date</th>
                                <th>Expiry Status</th>
                                <th>Supplier</th>
                                <th>Batch No</th>
                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filteredItems.length === 0 ?

                                (

                                    <tr>

                                        <td
                                            colSpan="12"
                                            style={{
                                                textAlign: "center",
                                                padding: "30px"
                                            }}
                                        >

                                            No Stock Items Found

                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    filteredItems.map((item) => (

                                        <tr key={item.id}>

                                            <td>{item.id}</td>

                                            <td>{item.product_name}</td>

                                            <td>{item.category}</td>

                                            <td>{item.quantity}</td>

                                            <td>₹{item.price}</td>

                                            <td>{item.import_date}</td>

                                            <td>{item.manufacture_date}</td>

                                            <td>{item.expire_date}</td>

                                            <td>

                                                {

                                                    getExpiryStatus(item.expire_date) === "Fresh" ?

                                                        <span className="fresh">

                                                            Fresh

                                                        </span>

                                                        :

                                                        getExpiryStatus(item.expire_date) === "Expiring Soon" ?

                                                            <span className="expiring">

                                                                Expiring Soon

                                                            </span>

                                                            :

                                                            <span className="expired">

                                                                Expired

                                                            </span>

                                                }

                                            </td>

                                            <td>{item.supplier}</td>

                                            <td>{item.batch}</td>

                                            <td>

                                                <button
                                                    className="edit-btn"
                                                    onClick={() => editItem(item)}
                                                >

                                                    Edit

                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => deleteItem(item.id)}
                                                >

                                                    Delete

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )

                            }

                        </tbody>

                    </table>

                </div>
                            </div>

        </div>

    );

}

export default StockDetails;