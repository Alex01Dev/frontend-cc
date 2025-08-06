// Layout.jsx
import React from "react";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "60px", padding: "1rem", backgroundColor: "#f8fff8", minHeight: "100vh" }}>
        {children}
      </main>
    </>
  );
}

export default Layout;
