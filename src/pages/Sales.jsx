import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Sales.css";

function Sales() {

  const API_URL = "http://127.0.0.1:5003";
  console.log(API_URL);

  const [productsData, setProductsData] = useState([]);
  const [sales, setSales] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [saleDate, setSaleDate] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [search, setSearch] = useState("");

  const [rows, setRows] = useState([]);

  const [grandTotal, setGrandTotal] = useState(0);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cashSales, setCashSales] = useState(0);
  const [bankSales, setBankSales] = useState(0);

  const [billContent, setBillContent] =
    useState("No Bill Generated");

  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  async function loadProducts() {

    try {
      // var salesId= localStorage.getItem("salesId");
      // console.log("Sales ID:", salesId);
      const response = await fetch(
        `${API_URL}/products`
      );
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Unable to fetch products");
      }

      const data = await response.json();

      setProductsData(data);

    }
    catch (error) {

      console.log(error);

      alert("Unable to load products");

    }

  }

  async function loadSales() {

    try {

      const response = await fetch(
        `${API_URL}/sales`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch sales");
      }

      const data = await response.json();

      setSales(data);

      let revenue = 0;
      let cash = 0;
      let online = 0;

      data.forEach((item) => {

        revenue += Number(item.grand_total);

        if (item.payment_method === "Cash") {

          cash += Number(item.grand_total);

        }

        if (item.payment_method === "Online") {

          online += Number(item.grand_total);

        }

      });

      setTotalRevenue(revenue);

      setCashSales(cash);

      setBankSales(online);

    }

    catch (error) {

      console.log(error);

    }

  }

  function addRow() {

    setRows([
      ...rows,
      {
        product_name: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ]);

  }

  function updatePrice(index, value) {
    console.log(value);
    console.log(productsData);

    const updatedRows = [...rows];

    const product = productsData.find(
      (item) => item.product_name === value
    );
    console.log(product);
    updatedRows[index].product_name = value;

    updatedRows[index].price = product
      ? product.price
      : 0;

    updatedRows[index].total =
      updatedRows[index].quantity *
      updatedRows[index].price;

    setRows(updatedRows);

    calculateGrandTotal(updatedRows);

  }

  function calculateRow(index, qty) {

    const updatedRows = [...rows];

    updatedRows[index].quantity = qty;

    updatedRows[index].total =
      updatedRows[index].price * qty;

    setRows(updatedRows);

    calculateGrandTotal(updatedRows);

  }

  function calculateGrandTotal(updatedRows) {

    let total = 0;

    updatedRows.forEach((item) => {

      total += Number(item.total);

    });

    setGrandTotal(total);

  }
    function removeRow(index) {

    const updatedRows = [...rows];

    updatedRows.splice(index, 1);

    setRows(updatedRows);

    calculateGrandTotal(updatedRows);

  }

  async function deleteSale(id) {

    if (!window.confirm("Delete Sale?")) return;

    try {

      const response = await fetch(
        `${API_URL}/delete_sale/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      alert(result.message);

      loadSales();
      setRows([]);
      setGrandTotal(0);

      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setSaleDate("");

    } catch (error) {

      console.log(error);

    }

  }

  async function payOnline(amount, saleData) {
    console.log("Payment Clicked");
    console.log(window.Razorpay);
    if (typeof window.Razorpay === "undefined") {

      alert("Razorpay SDK Not Loaded");

      return;

    }

    const options = {

      key: "rzp_test_SyEake7SXg5SeL",

      amount: parseInt(amount) * 100,

      currency: "INR",

      name: "Smart Grocery Store",

      description: "Product Purchase",

      prefill: {

        name: customerName,

        email: customerEmail,

        contact: customerPhone,

      },

      theme: {

        color: "#2563eb",

      },

      handler: async function (response) {

        alert(
          "Payment Successful\n" +
          response.razorpay_payment_id
        );

        const res = await fetch(
          `${API_URL}/add_sale`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify(saleData),

          }
        );

        const result = await res.json();

        alert(result.message);

        loadSales();
        setRows([]);
        setGrandTotal(0);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setSaleDate("");

      },

      modal: {

        ondismiss: function () {

          alert("Payment Cancelled");

        },

      },

    };

    const rzp = new window.Razorpay(options);

    rzp.open();

  }

  async function addSale() {

    if (rows.length === 0) {

      alert("Add Products");

      return;

    }

    const data = {

      bill_no:
        "BILL" + Date.now(),

      customer_name:
        customerName,

      customer_phone:
        customerPhone,

      customer_email:
        customerEmail,

      sale_date:
        saleDate,

      payment_method:
        paymentMethod,

      payment_status:
        paymentStatus,

      grand_total:
        grandTotal,

      items: rows,

    };

    if (paymentMethod === "Online") {

      payOnline(grandTotal, data);

      return;

    }

    try {

      const response = await fetch(
        `${API_URL}/add_sale`,
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify(data),

        }
      );

      const result = await response.json();

      alert(result.message);

      loadSales();

      setRows([]);

      setGrandTotal(0);

    }

    catch (error) {

      console.log(error);

    }

  }

  const filteredSales = sales.filter((item) =>
    item.customer_name
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

            <h1>💰 Sales Management</h1>

            <p>
              Manage Sales, Billing & Payments
            </p>

          </div>

          <div className="header-actions">

            <input
              type="text"
              placeholder="🔍 Search Customer"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button className="add-btn">
              Search
            </button>

          </div>

        </div>

        {/* Dashboard Cards */}

        <div className="cards">

          <div className="card revenue">

            <h3>Total Revenue</h3>

            <h1>₹{totalRevenue}</h1>

            <p>Overall Revenue</p>

          </div>

          <div className="card orders">

            <h3>Total Orders</h3>

            <h1>{sales.length}</h1>

            <p>Completed Orders</p>

          </div>

          <div className="card cash">

            <h3>Cash Sales</h3>

            <h1>₹{cashSales}</h1>

            <p>Cash Payments</p>

          </div>

          <div className="card banking">

            <h3>Online</h3>

            <h1>₹{bankSales}</h1>

            <p>Online Payments</p>

          </div>

        </div>

        {/* Customer Details */}

        <div className="table-section">

          <div className="table-header">

            <h2>👤 Customer Details</h2>

          </div>

          <div className="customer-form">

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={customerEmail}
              onChange={(e) =>
                setCustomerEmail(e.target.value)
              }
            />

            <input
              type="date"
              value={saleDate}
              onChange={(e) =>
                setSaleDate(e.target.value)
              }
            />

          </div>

        </div>

        {/* Products */}

        <div className="table-section">

          <div className="table-header">

            <h2>🛒 Products</h2>

            <button
              className="add-btn"
              onClick={addRow}
            >
              + Add Product
            </button>

          </div>

          <table>

            <thead>

              <tr>

                <th>Product</th>

                <th>Quantity</th>

                <th>Price</th>

                <th>Total</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {rows.map((row, index) => (

                <tr key={index}>

                  <td>

                    <select
                      value={row.product_name}
                      onChange={(e) =>
                        updatePrice(
                          index,
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select Product
                      </option>

                      {productsData.map((product) => (

                        <option
                          key={product.product_name}
                          value={product.product_name}
                        >

                          {product.product_name}

                        </option>

                      ))}

                    </select>

                  </td>

                  <td>

                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) =>
                        calculateRow(
                          index,
                          Number(e.target.value)
                        )
                      }
                    />

                  </td>

                  <td>

                    ₹{row.price}

                  </td>

                  <td>

                    ₹{row.total}

                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        removeRow(index)
                      }
                    >

                      Delete

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ================= PAYMENT DETAILS ================= */}

<div className="table-section payment-section">

  <div className="table-header">
    <h2>💳 Payment Details</h2>
  </div>

  <div className="payment-grid">

    <div className="payment-box">

      <label>Payment Method</label>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="Cash">Cash</option>
        <option value="Online">Online (Razorpay)</option>
      </select>

    </div>

    <div className="payment-box">

      <label>Payment Status</label>

      <select
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
      >
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
      </select>

    </div>

    <div className="payment-box total-box">

      <label>Grand Total</label>

      <h2>₹{grandTotal}</h2>

    </div>

  </div>

  <div className="payment-buttons">

    <button
      className="save-btn"
      onClick={addSale}
    >
      Save Sale
    </button>

    <button
      className="bill-btn"
      onClick={generateBill}
    >
      Generate Bill
    </button>

    <button
      className="print-btn"
      onClick={printBill}
    >
      Print Bill
    </button>

  </div>

</div>
               

        

        {/* Sales List */}

        <div className="table-section">

          <div className="table-header">

            <h2>📋 Sales List</h2>

          </div>

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Bill No</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {

                filteredSales.map((item) => (

                  <tr key={item.id}>

                    <td>{item.id}</td>

                    <td>{item.bill_no}</td>

                    <td>{item.customer_name}</td>

                    <td>₹{item.grand_total}</td>

                    <td>{item.payment_method}</td>

                    <td>{item.payment_status}</td>

                    <td>{item.sale_date}</td>

                    <td>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteSale(item.id)
                        }
                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        </div>

        {/* Generated Bill */}

        <div className="table-section">

          <div className="table-header">

            <h2>🧾 Generated Bill</h2>

          </div>

          <div
            id="billContent"
            dangerouslySetInnerHTML={{
              __html: billContent,
            }}
          />

        </div>

      </div>

    </div>

  );

  function generateBill() {

    let productsHTML = "";

    rows.forEach((row) => {

      productsHTML += `

      <tr>

        <td>${row.product_name}</td>

        <td>${row.quantity}</td>

        <td>₹${row.price}</td>

        <td>₹${row.total}</td>

      </tr>

      `;

    });

    const html = `

    <div
      style="
      max-width:700px;
      margin:auto;
      background:white;
      padding:25px;
      border-radius:15px;
      border:2px solid #ddd;
      "
    >

      <center>

        <h1>
          SMART GROCERY STORE
        </h1>

        <p>
          Chennai, Tamil Nadu
        </p>

        <p>
          Phone : +91 9876543210
        </p>

      </center>

      <hr>

      <p>

        <b>Bill No :</b>

        BILL${Date.now()}

      </p>

      <p>

        <b>Date :</b>

        ${saleDate}

      </p>

      <hr>

      <h3>

        Customer Details

      </h3>

      <p>

        <b>Name :</b>

        ${customerName}

      </p>

      <p>

        <b>Phone :</b>

        ${customerPhone}

      </p>

      <p>

        <b>Email :</b>

        ${customerEmail}

      </p>

      <hr>

      <table
        border="1"
        width="100%"
        cellspacing="0"
        cellpadding="8"
      >

        <tr>

          <th>Product</th>

          <th>Qty</th>

          <th>Price</th>

          <th>Total</th>

        </tr>

        ${productsHTML}

      </table>

      <br>

      <h2
        style="
        text-align:right;
        color:green;
        "
      >

        Grand Total :
        ₹${grandTotal}

      </h2>

      <p>

        <b>Payment :</b>

        ${paymentMethod}

      </p>

      <p>

        <b>Status :</b>

        ${paymentStatus}

      </p>

      <hr>

      <center>

        <h3>

          Thank You For Shopping

        </h3>

        <p>

          Visit Again

        </p>

      </center>

    </div>

    `;

    setBillContent(html);

    alert(
      "Bill Generated Successfully"
    );

  }

  function printBill() {

    const win = window.open(
      "",
      "",
      "width=900,height=700"
    );

    win.document.write(billContent);

    win.document.close();

    win.print();

  }

}

export default Sales;
    