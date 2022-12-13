import React from "react";
import { Outlet } from "react-router-dom"; 
import Footer from "../partials/Footer"; 
import Navbar from "../partials/Navbar"; 
import AlertNetwork from "../../components/AlertNetwork";
import { CartProvider } from "react-use-cart";

const Find = () => { 
  return (
    <>
      <AlertNetwork /> 
      <div className="container-fluid">
        <Navbar showSearch={true} />
      </div>
      <CartProvider id="ensocean_favorites">
        <Outlet />
        </CartProvider>
      <Footer />
    </>
  )
};

export default Find;