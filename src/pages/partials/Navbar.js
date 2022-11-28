import logo from "../../assets/icon.png";
import { Link, Navigate } from "react-router-dom";  
import {useNavigate} from 'react-router-dom';
import listIcon from "../../assets/list.svg";
import ConnectButton from "./ConnectButton";
import AlertNetwork from "./AlertNetwork";
import { useState } from "react";
import searchIcon from "../../assets/search.svg";
import { useAccount } from "wagmi";

const Navbar = () => {  
    const [value, setValue] = useState(""); 
    const { address, isConnected } = useAccount(); 
     
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
        <nav id="navbar" className="navbar navbar-expand-lg">
            <div className="container-fluid p-0">
                <a className="navbar-brand" title="EnsOcean" href="/">
                    <img src={logo} alt="EnsOcean" className="align-text-top me-1" />
                    EnsOcean
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button> 
                <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <a className="navbar-brand" title="EnsOcean" href="/">
                            <img src={logo} alt="EnsOcean" className="align-text-top me-1" /><span className="logo">EnsOcean</span>
                        </a>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <form className="flex-grow-1" role="search" onSubmit={handleSubmit}>
                            <div className="input-group input-group-lg">
                                <input className="form-control border-primary" type="search" placeholder="Search for web3 name " value={value} onChange={handleChange} />
                                <button className="btn btn-outline-primary" type="submit">
                                    <img src={searchIcon}  alt=""  />
                                </button>
                            </div>
                        </form>
                        <ul className="navbar-nav justify-content-start align-items-canter flex-grow-1 mt-3 mt-lg-1 ">
                            <li className="nav-item">
                                <a className="nav-link active" href="/">Home</a>
                            </li> 
                            <li className="nav-item">
                                <a className="nav-link active" href="/discover">Discover</a>
                            </li> 
                        </ul>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
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