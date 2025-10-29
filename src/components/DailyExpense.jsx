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
  const [editId, setEditId] = useState(null); // ✅ Track which expense is being edited
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // ✅ Fetch all previous expenses
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
  }, [navigate, token]);

  // ✅ Handle Input Change
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ Handle Add / Update Expense
  async function handleForm(e) {
    e.preventDefault();

    const expenseData = {
      money: formData.money,
      description: formData.description,
      category: formData.category,
      date: new Date().toLocaleString(),
    };

    // 🟩 If editing — do a PUT request
    if (editId) {
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

        console.log("✅ Expense successfully updated");
        setEditId(null);
        setFormData({ money: "", description: "", category: "Food" });
      } catch (err) {
        console.error("Error updating expense:", err.message);
      }
      return;
    }

    // 🟦 If adding new — do a POST request
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

      setExpenses((prev) => [...prev, { id: data.name, ...expenseData }]);
      setFormData({ money: "", description: "", category: "Food" });
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  }

  // ✅ DELETE Expense
  async function handleDelete(id) {
    try {
      const res = await fetch(
        `${FIREBASE_DB_URL}/expenses/${id}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete expense");

      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      console.log("✅ Expense successfully deleted");
    } catch (err) {
      console.error("Error deleting expense:", err.message);
    }
  }

  // ✅ EDIT Expense
  function handleEdit(exp) {
    setEditId(exp.id);
    setFormData({
      money: exp.money,
      description: exp.description,
      category: exp.category,
    });
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
  actionBtn: {
    padding: "5px 10px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    margin: "0 5px",
    cursor: "pointer",
  },
};

export default DailyExpense;
