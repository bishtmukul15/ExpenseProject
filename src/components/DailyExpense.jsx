import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DailyExpense = () => {
  const [formData, setFormData] = useState({
    money: "",
    description: "",
    category: "Food",
  });
  const [expenses, setExpenses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
    else navigate("/login");
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleForm(e) {
    e.preventDefault();

    const newExpense = {
      money: formData.money,
      description: formData.description,
      category: formData.category,
      id: Date.now(), // unique id for list rendering
    };

    // Add expense to the list
    setExpenses((prev) => [...prev, newExpense]);

    // Clear inputs
    setFormData({ money: "", description: "", category: "Food" });
  }

  if (!isLoggedIn) {
    return (
      <div style={styles.notLogged}>
        <h2>Please login first to view your Daily Expenses.</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>💰 Daily Expense Tracker</h2>
      <form onSubmit={handleForm} style={styles.form}>
        <input
          type="number"
          placeholder="Money Spent"
          name="money"
          value={formData.money}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Entertainment">Entertainment</option>
        </select>

        <button type="submit" style={styles.button}>
          Add Expense
        </button>
      </form>

      <hr />

      <h3>Your Expenses:</h3>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <ul style={styles.list}>
          {expenses.map((exp) => (
            <li key={exp.id} style={styles.item}>
              <strong>₹{exp.money}</strong> — {exp.description} (
              <em>{exp.category}</em>)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 🎨 Basic Styling
const styles = {
  container: {
    width: "400px",
    margin: "60px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  select: {
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
  list: {
    listStyleType: "none",
    padding: 0,
    textAlign: "left",
  },
  item: {
    backgroundColor: "#fff",
    padding: "8px",
    borderRadius: "6px",
    marginTop: "5px",
    border: "1px solid #ddd",
  },
  notLogged: {
    textAlign: "center",
    marginTop: "80px",
  },
};

export default DailyExpense;
