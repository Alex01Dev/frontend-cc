import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ marginLeft: "220px", marginTop: "60px", padding: "1rem", width: "100%" }}>
          {children}
        </main>
      </div>
    </>
  );
}

export default Layout;
