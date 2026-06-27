import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

 const handleLogin = async () => {
  console.log("login");
    try {
      const res = await axios.post(
       "https://thinksync-backend.onrender.com/api/auth/login",
        form
      );
      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username); 

      alert("Login success");
      window.location.href = "/";
    } catch (err) {
  console.error("Login error:", err.response?.data || err.message);
  alert(err.response?.data?.message || "Login failed");
}
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to ThinkSync</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleLogin}>Login</button>
        <p style={{ marginTop: "10px" }}>
  Don't have an account? <a href="/register">Register</a>
</p>
      </div>
    </div>
  );
}
