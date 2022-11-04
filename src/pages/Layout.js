import { Outlet } from "react-router-dom";
import Footer from "./partials/Footer";
import Navbar from "./partials/Navbar";

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