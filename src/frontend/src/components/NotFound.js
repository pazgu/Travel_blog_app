import React from "react";

function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.text}>The requested page does not exist.</p>
    </div>
  );
}

export default NotFound;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    paddingTop: "20vh", 
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#000",
  },
  text: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#000",
  },
};