import logo from "../../assets/icon.png";
import ConnectButton from "../../components/ConnectButton";
import AutoComplete from "../../components/AutoComplete";
import BasketButton from "../../components/BasketButton"; 
import { useAccount } from 'wagmi';  
import WatchlistLink from "../../components/WatchlistLink";

const Navbar = ({showSearch}) => {   
    const { isConnected, address } = useAccount();   

    return (
        <> 
        <nav id="navbar" className="navbar navbar-expand-lg ">
            <div className="container-fluid p-0 d-flex flex-row gap-1">
                <a className="navbar-brand me-1" title="EnsOcean" href="/">
                    <img src={logo} alt="EnsOcean" className="align-text-top me-1" />
                    EnsOcean
                </a>
                <div className="d-flex flex-row justify-content-end align-items-center gap-1">         
                    <div className="d-lg-none d-flex flex-row">
                        <ConnectButton smallButton={true} />
                        <BasketButton smallButton={true} />
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button> 
                </div>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header pb-0">
                        <a className="navbar-brand" title="EnsOcean" href="/">
                            <img src={logo} alt="EnsOcean" className="align-text-top me-1" /><span className="logo">EnsOcean</span>
                        </a>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        {showSearch === true &&  
                            <AutoComplete />  
                        }
                        <ul className="navbar-nav justify-content-start align-items-lg-center flex-grow-1 mt-2 mt-lg-0">
                            <li className="nav-item">
                                <a className="nav-link fw-bold" href="/find">Find</a>
                            </li> 
                            <li className="nav-item">
                                <a className="nav-link fw-bold" href="/discover">Browse</a>
                            </li> 
                            {isConnected && 
                                <li className="nav-item">
                                    <a className="nav-link fw-bold" title={"My Portfolio"} href={"/account/"+ address }> 
                                        My Domains
                                    </a> 
                                </li>
                            }
                            <li className="nav-item">
                                <WatchlistLink />
                            </li> 
                        </ul>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
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