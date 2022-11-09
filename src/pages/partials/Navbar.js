import logo from "../../assets/icon.png";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import NavbarSearchFrom from "../../components/NavbarSearchForm";
import {useNavigate} from 'react-router-dom';


const Navbar = () => {  
    return (
        <nav className="navbar navbar-expand-lg p-3">
            <div className="container-fluid">
            <Link className="navbar-brand" title="EnsOcean" to="/">
                <img src={logo} alt="EnsOcean" className="float-start me-1" /><span className="logo">EnsOcean</span>
            </Link> 
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                    <path  fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
                </svg>
            </button>
            <div className="collapse navbar-collapse" id="navbarContent">
                <NavbarSearchFrom navigate={useNavigate()} />
                <ul className="navbar-nav w-100">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/">Home</Link>
                    </li> 
                    <li className="nav-item">
                        <Link className="nav-link active" to="/discover">Discover</Link>
                    </li>
                </ul>
            </div>  
            </div>
        </nav>
    )
}

export default Navbar;