import React from "react";
import { Outlet } from "react-router-dom";
import AlertNetwork from "../partials/AlertNetwork";
import Footer from "../partials/Footer";
import Navbar from "../partials/Navbar"; 

const Page = () => { 
  return (
    <>
      <AlertNetwork /> 
      <div className="container-fluid">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
    </>
  )
};

export default Page;