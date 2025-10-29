import React, { useEffect, useState } from "react";

// Replace with your Firebase Web API Key
const FIREBASE_API_KEY = "AIzaSyCAUH6t36-km79JywjWzXvpPlXy-iTqbMs";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    async function fetchUserData() {
      if (!token) return;

      try {
        setLoading(true);
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token }),
          }
        );

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error?.message || "Failed to fetch user");

        const user = data.users[0];
        setFullName(user.displayName || "");
        setPhotoUrl(user.photoUrl || "");
        setIsProfileComplete(Boolean(user.displayName || user.photoUrl));
        setEmailVerified(Boolean(user.emailVerified));
        setEmail(user.email || "");
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        setMessage("Error fetching profile: " + (error.message || "Unknown"));
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [token]);

  // Update profile (displayName, photoUrl)
  async function handleUpdate() {
    if (!fullName || !photoUrl) {
      setMessage("Please fill all details!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
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
        throw new Error(data.error?.message || "Profile update failed!");
      }

      setMessage("✅ Profile Updated Successfully!");
      setIsEditing(false);
      setIsProfileComplete(true);

      // If response contains refreshed tokens, you might want to store them
      if (data.idToken) localStorage.setItem("authToken", data.idToken);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ---- New: Send email verification using Firebase REST API ----
  async function sendEmailVerification() {
    if (!token) {
      setMessage("You must be signed in to verify your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestType: "VERIFY_EMAIL", idToken: token }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Firebase returns { error: { message: "SOME_CODE" } }
        const code = data?.error?.message || "UNKNOWN_ERROR";
        throw new Error(code);
      }

      // success
      setMessage(
        `Check your email (${email}). You might have received a verification link — click it to verify.`
      );
    } catch (err) {
      // Map common Firebase error codes to friendly messages
      const code = (err.message || "").toString();
      console.error("sendEmailVerification error:", code);

      let friendly = "Failed to send verification email.";

      if (code.includes("INVALID_ID_TOKEN")) {
        friendly = "Your session is invalid or expired. Please sign in again.";
      } else if (code.includes("USER_NOT_FOUND")) {
        friendly = "User not found. The account may have been deleted.";
      } else if (code.includes("EMAIL_NOT_FOUND")) {
        friendly = "Email not found for this account.";
      } else if (code.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        friendly = "Too many requests. Try again later.";
      } else if (code.includes("OPERATION_NOT_ALLOWED")) {
        friendly =
          "Email actions are disabled for this project in Firebase console.";
      } else if (code === "UNKNOWN_ERROR") {
        friendly = "Unknown error from Firebase. Check API key and network.";
      }

      setMessage(friendly + (code ? ` (${code})` : ""));
    } finally {
      setLoading(false);
    }
  }

  // When not editing, show appropriate screen
  if (!isEditing) {
    return (
      <div style={styles.container}>
        <h2>Welcome to Expense Tracker 🎯</h2>

        {loading && <p>Loading...</p>}

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
              <p>
                <b>Email:</b> {email || "N/A"}
              </p>
              <p>
                <b>Email Verified:</b>{" "}
                {emailVerified ? (
                  <span style={{ color: "green" }}>Yes ✅</span>
                ) : (
                  <span style={{ color: "red" }}>No ❌</span>
                )}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={styles.button} onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>

              {/* Show verify button only when email is not verified */}
              {!emailVerified && (
                <button
                  style={{ ...styles.button, backgroundColor: "#28a745" }}
                  onClick={sendEmailVerification}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Verify Email ID"}
                </button>
              )}
            </div>
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

  // When editing, show update form
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
          <button
            style={styles.button}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
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

const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px",
    fontFamily: "Arial",
  },
  profileBox: {
    border: "1px solid #ccc",
    padding: "15px",
    width: "320px",
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
