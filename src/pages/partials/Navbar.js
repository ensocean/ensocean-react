import logo from "../../assets/icon.png";
import { Link } from "react-router-dom";

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
                <form className="w-100" role="search">
                <div className="input-group input-group-lg">
                    <input className="form-control border-primary" type="search" placeholder="Search for web3 name .eth " />
                    <button className="btn btn-outline-primary" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                    </svg>
                    </button>
                </div>
                </form>
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