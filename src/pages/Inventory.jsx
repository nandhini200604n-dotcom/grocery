import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Inventory.css";

function Inventory() {
  const API_URL = "http://127.0.0.1:5003";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const response = await fetch(`${API_URL}/stockdetails`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteItem(id) {
    if (!window.confirm("Delete this item?")) return;

    try {
      await fetch(`${API_URL}/delete_inventory/${id}`, {
        method: "DELETE",
      });

      alert("Inventory Deleted Successfully");
      loadInventory();
    } catch (error) {
      console.log(error);
    }
  }

  function editItem(item) {
    alert("Edit functionality will be added next.");
  }

  const total = products.length;

  const stock = products.filter(
    (item) => Number(item.quantity) > 10
  ).length;

  const low = products.filter(
    (item) =>
      Number(item.quantity) > 0 &&
      Number(item.quantity) <= 10
  ).length;

  const out = products.filter(
    (item) => Number(item.quantity) === 0
  ).length;

  const filteredProducts = products.filter((item) =>
    item.product_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <Sidebar />

      <div className="main-content">

        {/* Header */}

        <div className="header">

          <div>
            <h1>📦 Inventory Management</h1>
            <p>Manage and track your grocery stock efficiently</p>
          </div>

          <div className="header-actions">
            <input
              type="text"
              placeholder="🔍 Search Product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            <h1>{total}</h1>
            <p>Products Available</p>
          </div>

          <div className="card stock">
            <h3>In Stock</h3>
            <h1>{stock}</h1>
            <p>Ready For Sale</p>
          </div>

          <div className="card low">
            <h3>Low Stock</h3>
            <h1>{low}</h1>
            <p>Need Restocking</p>
          </div>

          <div className="card out">
            <h3>Out Of Stock</h3>
            <h1>{out}</h1>
            <p>Unavailable</p>
          </div>

        </div>

        {/* Table */}

        <div className="table-section">

          <div className="table-header">
            <h2>Inventory List</h2>
          </div>

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Batch No</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "30px" }}>
                    No Products Found
                  </td>
                </tr>

              ) : (

                filteredProducts.map((item) => (

                  <tr key={item.id}>

                    <td>{item.id}</td>

                    <td>{item.product_name}</td>

                    <td>{item.category}</td>

                    <td>{item.quantity}</td>

                    <td>

                      {Number(item.quantity) === 0 ? (

                        <span className="status red">
                          Out Of Stock
                        </span>

                      ) : Number(item.quantity) <= 10 ? (

                        <span className="status orange">
                          Low Stock
                        </span>

                      ) : (

                        <span className="status green">
                          In Stock
                        </span>

                      )}

                    </td>

                    <td>₹{item.price}</td>

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

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Inventory;