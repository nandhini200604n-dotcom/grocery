import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";
import logo from "../assets/logo.png";

function Dashboard() {

  const API_URL = "http://127.0.0.1:5003";

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      // Inventory
      const inventoryResponse = await fetch(`${API_URL}/inventory`);
      const inventoryData = await inventoryResponse.json();

      setTotalProducts(inventoryData.length);

      const low = inventoryData.filter(
        (item) => Number(item.quantity) < 10
      );

      setLowStock(low.length);

      // Sales
      const salesResponse = await fetch(`${API_URL}/sales`);
      const salesData = await salesResponse.json();

      setTotalOrders(salesData.length);

    } catch (error) {

      console.log(error);

    }

  }

  return (

    <div className="container">

      <Sidebar />

      <div className="main-content">

        <div className="header">

          <h1>🛒 Smart Grocery Store Dashboard</h1>

        </div>

        <div className="welcome-card">

          <div>

            <h2>Welcome!</h2>

            <p>
              Here's what's happening with your store today.
            </p>

          </div>

          

        </div>

        {/* Cards */}

        <div className="cards">

          <div className="card products">

            <h3>Total Items</h3>

            <h1>{totalProducts}</h1>

            <p>Total number of items in the store</p>

          </div>

          <div className="card sales">

            <h3>Total Orders</h3>

            <h1>{totalOrders}</h1>

            <p>Total orders across transactions</p>

          </div>

          <div className="card stock">

            <h3>Low Stock Items</h3>

            <h1>{lowStock}</h1>

            <p>Products that are low in stock</p>

          </div>

        </div>

        {/* Bottom */}

        <div className="bottom-section">

          <div className="overview">

            <h2>📊 Quick Overview</h2>

            <p>
              Total Items :
              <span> {totalProducts}</span>
            </p>

            <p>
              Total Orders :
              <span> {totalOrders}</span>
            </p>

            <p>
              Low Stock Items :
              <span> {lowStock}</span>
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;