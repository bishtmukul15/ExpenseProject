import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FIREBASE_DB_URL =
  "https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/";
const DailyExpense = () => {
  const [formData, setFormData] = useState({
    money: "",
    description: "",
    category: "Food",
  });
  const [expenses, setExpenses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  // ✅ Fetch all previous expenses on page load
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setIsLoggedIn(true);

    async function fetchExpenses() {
      try {
        const res = await fetch(
          `${FIREBASE_DB_URL}/expenses.json?auth=${token}`
        );
        if (!res.ok) throw new Error("Failed to fetch expenses");
        const data = await res.json();

        // Convert object to array (Firebase stores objects)
        const loadedExpenses = [];
        for (let key in data) {
          loadedExpenses.push({ id: key, ...data[key] });
        }
        setExpenses(loadedExpenses);
      } catch (err) {
        console.error("Error fetching expenses:", err.message);
      }
    }

    fetchExpenses();
  }, [navigate, token]);

  // ✅ Handle Input Change
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ Handle Add Expense (POST to Firebase)
  async function handleForm(e) {
    e.preventDefault();

    const newExpense = {
      money: formData.money,
      description: formData.description,
      category: formData.category,
      date: new Date().toLocaleString(),
    };

    try {
      const res = await fetch(
        `${FIREBASE_DB_URL}/expenses.json?auth=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExpense),
        }
      );

      if (!res.ok) throw new Error("Failed to store expense");

      const data = await res.json(); // contains { name: "unique_id" }
      // Add new expense to the list immediately
      setExpenses((prev) => [...prev, { id: data.name, ...newExpense }]);

      // Reset form
      setFormData({ money: "", description: "", category: "Food" });
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
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
          required
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
          required
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
              <em>{exp.category}</em>) <br />
              <small style={{ color: "#666" }}>{exp.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 🎨 Styling
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
