import React from "react";
import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

function MainLayout() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;
