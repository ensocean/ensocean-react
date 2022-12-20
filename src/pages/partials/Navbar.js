import logo from "../../assets/icon.png";
import ConnectButton from "../../components/ConnectButton";
import AutoComplete from "../../components/AutoComplete";
import BasketButton from "../../components/BasketButton"; 
import { useAccount } from 'wagmi';   
import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";
import { useWatchlist } from "react-use-watchlist";
import Numeral from "react-numeral";
import GasPriceButton from "../../components/GasPriceButton";
import WatchlistLink from "../../components/WatchlistLink";
import { useCart } from "react-use-cart";

const Navbar = ({showSearch}) => {   
    const { isConnected, address } = useAccount();   
    const  totalCartlistItems = useCart().totalUniqueItems;
    const  totalWatchlistItems = useWatchlist().totalUniqueItems;
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
 
    return (
        <> 
        <nav  id="navbar" className="navbar navbar-expand-lg">
            <div className="container-fluid p-0 d-flex flex-row gap-1">
                <Link className="navbar-brand me-1 fw-bold fs-3" title="EnsOcean" to="/">
                    <img src={logo} alt="EnsOcean" className="align-text-top me-1" />
                    EnsOcean
                </Link>
                <div className="d-flex flex-row justify-content-end align-items-center gap-2">         
                    <div className="d-lg-none d-flex flex-row gap-2">
                        
                        <ConnectButton smallButton={true} />
                    </div>
                    <button className="navbar-toggler p-1" type="button" onClick={(e)=> handleShow()}>
                        <span className="navbar-toggler-icon"></span>
                        <small className="position-absolute translate-middle badge rounded-pill bg-danger">
                            <Numeral value={totalCartlistItems + totalWatchlistItems} format={"0,0"} />
                        </small>
                    </button>
                </div>
                <Offcanvas show={show} onHide={handleClose} responsive="lg" placement="end" className="flex-grow-1">
                    <Offcanvas.Header closeButton>
                        <a className="navbar-brand" title="EnsOcean" href="/">
                            <img src={logo} alt="EnsOcean" className="align-text-top me-1" />
                        </a>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {showSearch === true &&  
                            <AutoComplete />  
                        }
                        <ul className="navbar-nav justify-content-start align-items-lg-center flex-grow-1 mt-2 mt-lg-0">
                            <li className="nav-item">
                                <Link onClick={ handleClose } className="nav-link fw-bold" to="/find">Find</Link>
                            </li> 
                            <li className="nav-item">
                                <Link onClick={ handleClose } className="nav-link fw-bold" to="/discover">Browse</Link>
                            </li> 
                            {isConnected && 
                                <li className="nav-item">
                                    <Link onClick={ handleClose } className="nav-link fw-bold" title={"My Portfolio"} to={"/account/"+ address }> 
                                        My Domains
                                    </Link> 
                                </li>
                            }
                            <li className="nav-item">
                                <WatchlistLink />
                            </li> 
                        </ul>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                            <GasPriceButton />
                            <BasketButton /> 
                            <ConnectButton />
                        </div> 
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </nav> 
        </>
    )
}

export default Navbar;