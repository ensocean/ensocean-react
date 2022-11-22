import logo from "../../assets/icon.png";
import { Link, Navigate } from "react-router-dom";  
import {useNavigate} from 'react-router-dom';
import listIcon from "../../assets/list.svg";
import ConnectButton from "./ConnectButton";
import AlertNetwork from "./AlertNetwork";
import { useState } from "react";
import searchIcon from "../../assets/search.svg";

const Navbar = () => {  
    const [value, setValue] = useState("");

    const handleChange = (e) => {
        setValue(e.target.value);
    };
 
    const handleSubmit = (e) => {  
        if(value.lastIndexOf(".eth") !== -1)
            Navigate("/"+ value)
        else if( value.lastIndexOf(".eth") === -1) {
            Navigate("/find?label="+ value)
        } 
        e.preventDefault();
        return false;
    };

    return (
        <>
        <AlertNetwork />
        <nav id="navbar" className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand me-4" title="EnsOcean" to="/">
                    <img src={logo} alt="EnsOcean" className="float-start me-1" /><span className="logo">EnsOcean</span>
                </Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button> 
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <Link className="navbar-brand" title="EnsOcean" to="/">
                            <img src={logo} alt="EnsOcean" className="float-start me-1" /><span className="logo">EnsOcean</span>
                        </Link>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <form className="flex-fill" role="search" onSubmit={handleSubmit}>
                            <div className="input-group input-group-lg">
                                <input className="form-control border-primary" type="search" placeholder="Search for web3 name " value={value} onChange={handleChange} />
                                <button className="btn btn-outline-primary" type="submit">
                                    <img src={searchIcon}  alt=""  />
                                </button>
                            </div>
                        </form>
                        <ul class="navbar-nav justify-content-start align-items-canter flex-grow-1 mt-3 mt-lg-1 ">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">Home</Link>
                            </li> 
                            <li className="nav-item">
                                <Link className="nav-link active" to="/discover">Discover</Link>
                            </li>
                        </ul>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <ConnectButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        </>
    )
}

export default Navbar;