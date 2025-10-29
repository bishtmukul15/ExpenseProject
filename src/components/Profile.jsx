import React, { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("authToken");

  // 🔹 Step 1: If not editing, show incomplete profile screen
  if (!isEditing) {
    return (
      <div style={styles.container}>
        <h2>Welcome to Expense Tracker 🎯</h2>
        <p style={styles.warning}>Your profile is incomplete!</p>
        <button style={styles.button} onClick={() => setIsEditing(true)}>
          Complete Profile
        </button>
      </div>
    );
  }

  // 🔹 Step 2: Update profile details to Firebase
  async function handleUpdate() {
    if (!fullName || !photoUrl) {
      setMessage("Please fill all details!");
      return;
    }

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCAUH6t36-km79JywjWzXvpPlXy-iTqbMs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: token,
            displayName: fullName,
            photoUrl: photoUrl,
            returnSecureToken: true,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message || "Profile update failed!");
      }

      setMessage("✅ Profile Updated Successfully!");
      console.log("Updated user details:", data);
      setIsEditing(false);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Complete Your Profile</h2>
      <div style={styles.form}>
        <label>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={styles.input}
        />

        <label>Profile Photo URL:</label>
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttons}>
          <button style={styles.button} onClick={handleUpdate}>
            Update
          </button>
          <button
            style={{ ...styles.button, backgroundColor: "gray" }}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

// 💅 Styles
const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px",
    fontFamily: "Arial",
  },
  form: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    padding: "8px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  warning: {
    color: "red",
    marginBottom: "15px",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  message: {
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default Profile;
