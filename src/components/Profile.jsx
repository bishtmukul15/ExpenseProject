import React, { useEffect, useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const token = localStorage.getItem("authToken");

  // 🔹 Fetch saved user details on component mount
  useEffect(() => {
    async function fetchUserData() {
      if (!token) return;

      try {
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCAUH6t36-km79JywjWzXvpPlXy-iTqbMs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token }),
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.error.message);

        const user = data.users[0];
        if (user.displayName || user.photoUrl) {
          setFullName(user.displayName || "");
          setPhotoUrl(user.photoUrl || "");
          setIsProfileComplete(true);
        } else {
          setIsProfileComplete(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    }

    fetchUserData();
  }, [token]);

  // 🔹 Update profile details
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
      setIsProfileComplete(true);
    } catch (err) {
      setMessage(err.message);
    }
  }

  // 🔹 When not editing, show appropriate screen
  if (!isEditing) {
    return (
      <div style={styles.container}>
        <h2>Welcome to Expense Tracker 🎯</h2>

        {isProfileComplete ? (
          <>
            <p style={{ color: "green" }}>Your profile is complete ✅</p>
            <div style={styles.profileBox}>
              <p>
                <b>Full Name:</b> {fullName || "N/A"}
              </p>
              <p>
                <b>Profile Photo:</b>{" "}
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    style={{ width: "80px", borderRadius: "50%" }}
                  />
                ) : (
                  "N/A"
                )}
              </p>
            </div>
            <button style={styles.button} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <p style={styles.warning}>Your profile is incomplete!</p>
            <button style={styles.button} onClick={() => setIsEditing(true)}>
              Complete Profile
            </button>
          </>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    );
  }

  // 🔹 When editing, show update form
  return (
    <div style={styles.container}>
      <h2>
        {isProfileComplete ? "Edit Your Profile" : "Complete Your Profile"}
      </h2>
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

// 💅 Styling
const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px",
    fontFamily: "Arial",
  },
  profileBox: {
    border: "1px solid #ccc",
    padding: "15px",
    width: "300px",
    margin: "10px auto",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
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
