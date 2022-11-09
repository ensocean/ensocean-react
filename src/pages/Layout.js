import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./partials/Footer";
import useGoogleAnalytics from "./partials/GoogleAnalytics";
import Navbar from "./partials/Navbar"; 

const Layout = () => { 
  useGoogleAnalytics()
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
};

export default Layout;