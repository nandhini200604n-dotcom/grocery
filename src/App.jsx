import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import StockDetails from "./pages/StockDetails";
import Sales from "./pages/Sales";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/inventory" element={<Inventory />} />

      <Route path="/stockdetails" element={<StockDetails />} />

      <Route path="/sales" element={<Sales />} />

    </Routes>
  );
}

export default App;