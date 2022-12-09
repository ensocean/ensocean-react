import React from "react";
import { Outlet } from "react-router-dom"; 
import Footer from "../partials/Footer"; 
import Navbar from "../partials/Navbar"; 
import AlertNetwork from "../../components/AlertNetwork";

const Home = () => { 
  return (
    <>
      <AlertNetwork /> 
      <div className="container-fluid">
        <Navbar showSearch={true} />
      </div>
      <Outlet />
      <Footer />
    </>
  )
};

export default Home;