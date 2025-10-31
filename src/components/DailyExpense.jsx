import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExpense } from "../Auth/context/ExpenseContext";
import { useTheme } from "../Auth/context/ThemeContext"; // 🌙 Added
const FIREBASE_DB_URL =
  "https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/";

const DailyExpense = () => {
  const [formData, setFormData] = useState({
    money: "",
    description: "",
    category: "Food",
  });

  const { expenses, setExpenses, addExpense, deleteExpense } = useExpense();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isPremium, setIsPremium] = useState(false); // 🌟 Local state for premium
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // 🌙 Theme hook
  const token = localStorage.getItem("authToken");

  // ✅ Fetch Expenses
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
  }, [navigate, token, setExpenses]);

  // ✅ Calculate total
  const totalExpense = expenses.reduce(
    (sum, exp) => sum + Number(exp.money || 0),
    0
  );

  // ✅ Activate Premium when >= 10,000
  useEffect(() => {
    if (totalExpense >= 10000) {
      setIsPremium(true);
    }
  }, [totalExpense]);

  // ✅ Handle Input
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ Add / Update Expense
  async function handleForm(e) {
    e.preventDefault();

    const expenseData = {
      money: formData.money,
      description: formData.description,
      category: formData.category,
      date: new Date().toLocaleString(),
    };

    if (editId) {
      // 🟩 Update
      try {
        const res = await fetch(
          `${FIREBASE_DB_URL}/expenses/${editId}.json?auth=${token}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData),
          }
        );
        if (!res.ok) throw new Error("Failed to update expense");
        setExpenses((prev) =>
          prev.map((exp) =>
            exp.id === editId ? { id: editId, ...expenseData } : exp
          )
        );
        setEditId(null);
        setFormData({ money: "", description: "", category: "Food" });
      } catch (err) {
        console.error("Error updating expense:", err.message);
      }
      return;
    }

    // 🟦 Add
    try {
      const res = await fetch(
        `${FIREBASE_DB_URL}/expenses.json?auth=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        }
      );
      if (!res.ok) throw new Error("Failed to store expense");
      const data = await res.json();
      addExpense({ id: data.name, ...expenseData });
      setFormData({ money: "", description: "", category: "Food" });
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  }

  // ✅ Delete Expense
  async function handleDelete(id) {
    try {
      const res = await fetch(
        `${FIREBASE_DB_URL}/expenses/${id}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete expense");
      deleteExpense(id);
    } catch (err) {
      console.error("Error deleting expense:", err.message);
    }
  }

  // ✅ Edit Expense
  function handleEdit(exp) {
    setEditId(exp.id);
    setFormData({
      money: exp.money,
      description: exp.description,
      category: exp.category,
    });
  }

  // ✅ Download CSV
  const handleDownload = () => {
    const csvData =
      "Description,Amount,Category,Date\n" +
      expenses
        .map(
          (exp) => `${exp.description},${exp.money},${exp.category},${exp.date}`
        )
        .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "expenses.csv";
    link.click();
  };

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
      <h4>Total Expense: ₹{totalExpense}</h4>

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
          {editId ? "Update Expense" : "Add Expense"}
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
              <br />
              <small style={{ color: "#666" }}>{exp.date}</small>
              <div style={{ marginTop: "5px" }}>
                <button
                  onClick={() => handleDelete(exp.id)}
                  style={{ ...styles.actionBtn, backgroundColor: "#dc3545" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(exp)}
                  style={{ ...styles.actionBtn, backgroundColor: "#28a745" }}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isPremium && (
        <div style={{ marginTop: "15px" }}>
          <button
            onClick={toggleTheme}
            style={{ ...styles.actionBtn, backgroundColor: "black" }}
          >
            Toggle {theme === "light" ? "Dark" : "Light"} Theme
          </button>
          <button
            onClick={handleDownload}
            style={{
              ...styles.actionBtn,
              backgroundColor: "gold",
              color: "black",
            }}
          >
            📥 Download CSV
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "60px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  select: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: { listStyleType: "none", padding: 0, textAlign: "left" },
  item: {
    backgroundColor: "#fff",
    padding: "8px",
    borderRadius: "6px",
    marginTop: "5px",
    border: "1px solid #ddd",
  },
  notLogged: { textAlign: "center", marginTop: "80px" },
  actionBtn: {
    padding: "7px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    margin: "5px",
    color: "white",
  },
};

export default DailyExpense;
