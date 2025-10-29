import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // 🔹 Handle login
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

      // 🧠 Store token securely
      localStorage.setItem("authToken", data.idToken);
      console.log("✅ Login successful! Token stored:", data.idToken);

      // Go to Welcome Screen
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
      alert("Invalid credentials or user not found!");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 If logged in, show welcome screen
  if (isLoggedIn) {
    return (
      <div style={styles.welcome}>
        <h2>Welcome to Expense Tracker 🎉</h2>
        <p>You have successfully logged in!</p>
      </div>
    );
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
  welcome: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial",
  },
};

export default Login;
