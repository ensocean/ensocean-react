import logo from "../../assets/icon.png";
import ConnectButton from "./ConnectButton";
import AutoComplete from "./AutoComplete";
import BasketButton from "../../components/BasketButton";

const Navbar = ({showSearch}) => {   
    
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
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <a className="navbar-brand" title="EnsOcean" href="/">
                            <img src={logo} alt="EnsOcean" className="align-text-top me-1" /><span className="logo">EnsOcean</span>
                        </a>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        {showSearch === true && 
                            <AutoComplete /> 
                        }
                        <ul className="navbar-nav justify-content-start align-items-center flex-grow-1">
                            <li className="nav-item">
                                <a className="nav-link fw-bold" href="/find">Find</a>
                            </li> 
                            <li className="nav-item">
                                <a className="nav-link fw-bold" href="/discover">Browse</a>
                            </li> 
                        </ul>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <BasketButton />
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