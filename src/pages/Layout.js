import React, {useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./partials/Footer";
import Navbar from "./partials/Navbar";
import ReactGA from "react-ga4"

const Layout = () => { 
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
};

export default Layout;