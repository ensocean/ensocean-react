import React from "react";
import { Outlet } from "react-router-dom";
import AlertNetwork from "../partials/AlertNetwork";
import Footer from "../partials/Footer"; 
import Navbar from "../partials/Navbar"; 

const Home = () => { 
  return (
    <>
      <AlertNetwork /> 
      <div className="container">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
    </>
  )
};

export default Home;