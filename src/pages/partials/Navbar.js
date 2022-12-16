import logo from "../../assets/icon.png";
import ConnectButton from "../../components/ConnectButton";
import AutoComplete from "../../components/AutoComplete";
import BasketButton from "../../components/BasketButton"; 
import { useAccount } from 'wagmi';  
import WatchlistLink from "../../components/WatchlistLink";
import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";
import { useWatchlist } from "react-use-watchlist";
import Numeral from "react-numeral";

const Navbar = ({showSearch}) => {   
    const { isConnected, address } = useAccount();   
    const { totalUniqueItems } = useWatchlist();

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
                <div className="d-flex flex-row justify-content-end align-items-center gap-1">         
                    <div className="d-lg-none d-flex flex-row">
                        <ConnectButton smallButton={true} />
                        <BasketButton smallButton={true} />
                    </div>
                    <button className="navbar-toggler" type="button" onClick={(e)=> handleShow()}>
                        <span className="navbar-toggler-icon"></span>
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
                                {isConnected && 
                                    <Link onClick={ handleClose } className="nav-link fw-bold" to={"/account/"+ address +"?tab=watchlist"}>
                                        Watchlist {" "}
                                        <small className="translate-middle ms-2 badge rounded-pill bg-danger">
                                            <Numeral value={totalUniqueItems} format={"0,0"} />
                                        </small>
                                    </Link>}
                            </li> 
                        </ul>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
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