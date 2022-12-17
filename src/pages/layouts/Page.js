import React from "react";
import { Outlet } from "react-router-dom"; 
import Footer from "../partials/Footer";
import Navbar from "../partials/Navbar"; 
import AlertNetwork from "../../components/AlertNetwork";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const Page = () => { 
  return (
    <>
      <AlertNetwork /> 
      <div className="container-fluid">
        <Navbar showSearch={true} />
      </div>
      <Outlet />
      <Footer />
      <ScrollToTopButton />
    </>
  )
};

export default Page;