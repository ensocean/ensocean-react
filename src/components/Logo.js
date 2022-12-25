import { Link } from "react-router-dom";
import logo from "../assets/icon.png";

function Logo() {
    return (
        <Link className="navbar-brand me-1 fw-bold fs-3" title="EnsOcean" to="/">
            <img src={logo} alt="EnsOcean" className="align-text-top me-1" />
            EnsOcean
        </Link>
    )
}

export default Logo;