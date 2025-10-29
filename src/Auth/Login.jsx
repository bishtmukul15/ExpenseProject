import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Step 1

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCAUH6t36-km79JywjWzXvpPlXy-iTqbMs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message || "Login failed");
      }

      // ✅ Store token
      localStorage.setItem("authToken", data.idToken);
      console.log("✅ Login successful! Token stored:", data.idToken);

      // ✅ Redirect to profile page
      navigate("/profile");
    } catch (err) {
      setError(err.message);
      alert("Invalid credentials or user not found!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h3>Login</h3>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
          <p
            style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </button>
      </form>
    </div>
  );
};

// 💅 Simple styling
const styles = {
  container: {
    width: "300px",
    margin: "60px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: { color: "red", fontSize: "14px" },
};

export default Login;
