import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth token from local storage
    localStorage.removeItem("authToken");

    // Optionally clear all storage if needed
    // localStorage.clear();

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h3>You have been logged out successfully.</h3>
      <p>Redirecting to Login...</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial",
  },
};

export default Logout;
