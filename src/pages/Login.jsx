import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const API_URL = "http://127.0.0.1:5003";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {

    // Temporary Login
    if (username === "admin" && password === "5678") {

      localStorage.setItem("isLoggedIn", "true");

      alert("Login Successful");

      navigate("/dashboard");

      return;

    }

    alert("Invalid Username or Password");

    /*
    // Backend Login (Enable Later)

    try {

      const response = await fetch(`${API_URL}/login`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          username,
          password

        })

      });

      const result = await response.json();

      if(result.success){

        localStorage.setItem("isLoggedIn","true");

        alert(result.message);

        navigate("/dashboard");

      }
      else{

        alert(result.message);

      }

    }
    catch(error){

      console.log(error);

      alert("Server Error");

    }

    */

  }

  return (

    <div className="login-container">

      <div className="login-box">

        <img
          src="/logo.png"
          alt="Logo"
          className="logo"
        />

        <h1>Smart Grocery Store</h1>

        <p>
          Manage your inventory and sales efficiently
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={login}>

          Login

        </button>

      </div>

    </div>

  );

}

export default Login;