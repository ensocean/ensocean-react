import logo from "../../assets/icon.png";
import { Link } from "react-router-dom"; 
import NavbarSearchFrom from "../../components/NavbarSearchForm";
import {useNavigate} from 'react-router-dom';
import listIcon from "../../assets/list.svg";
import ConnectButton from "./ConnectButton";
import AlertNetwork from "./AlertNetwork";
 

const Navbar = () => {  
    return (
        <>
        <AlertNetwork />
        <nav id="navbar" className="navbar navbar-expand-lg pt-2 pb-2">
            <div className="container-fluid">
                <Link className="navbar-brand me-4" title="EnsOcean" to="/">
                    <img src={logo} alt="EnsOcean" className="float-start me-1" /><span className="logo">EnsOcean</span>
                </Link>  
                <div className="collapse navbar-collapse" id="navbarContent">
                    <div className="">
                    <NavbarSearchFrom navigate={useNavigate()}  />
                    </div>
                    <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li> 
                        <li className="nav-item">
                            <Link className="nav-link active" to="/discover">Discover</Link>
                        </li>
                    </ul>  
                </div>
                <div className="">
                    <ul className="navbar-nav">
                        <li className="nav-item"> <ConnectButton /> </li>
                    </ul>
                </div> 
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <img src={listIcon} alt="" />
                </button>
            </div>
        </nav>
        </>
    )
}

export default Navbar;