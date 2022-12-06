import React from "react";
import { Outlet } from "react-router-dom"; 
import Footer from "../partials/Footer"; 
import Navbar from "../partials/Navbar"; 
import AlertNetwork from "../../components/AlertNetwork";

const Find = () => { 
  return (
    <>
      <AlertNetwork /> 
      <div className="container">
        <Navbar showSearch={false} />
      </div>
      <Outlet />
      <Footer />
    </>
  )
};

export default Find;