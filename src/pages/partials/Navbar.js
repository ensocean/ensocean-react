import logo from "../../assets/icon.png";
import { Link } from "react-router-dom"; 
import NavbarSearchFrom from "../../components/NavbarSearchForm";
import {useNavigate} from 'react-router-dom';
import listIcon from "../../assets/list.svg";

const Navbar = () => {  
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand me-4" title="EnsOcean" to="/">
                    <img src={logo} alt="EnsOcean" className="float-start me-1" /><span className="logo">EnsOcean</span>
                </Link> 
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <img src={listIcon} alt="" />
                </button>
                <div className="collapse navbar-collapse gap-2 mt-3 mt-lg-0 mt-md-3 mt-sm-3" id="navbarContent">
                    <NavbarSearchFrom navigate={useNavigate()}  />
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