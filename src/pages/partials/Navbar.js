import logo from "../../assets/icon.png";
import ConnectButton from "../../components/ConnectButton";
import AutoComplete from "../../components/AutoComplete";
import BasketButton from "../../components/BasketButton"; 
import { 
    useDisconnect, 
    useAccount,    
    useNetwork,
    useSwitchNetwork
  } from 'wagmi';
import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";
import { useWatchlist } from "react-use-watchlist";
import Numeral from "react-numeral";
import GasPriceButton from "../../components/GasPriceButton";
import WatchlistLink from "../../components/WatchlistLink";
import { useRegisterlist } from "react-use-registerlist";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { obscureAddress } from "../../helpers/String";
import { Bag } from "react-bootstrap-icons";

const Navbar = ({showSearch}) => {   
    const { isConnected, address } = useAccount();   
    const  totalRegisterlistItems = useRegisterlist().totalUniqueItems;
    const  totalWatchlistItems = useWatchlist().totalUniqueItems;
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork()
    const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { openConnectModal } = useConnectModal(); 
    const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleConnect = (e) => {
        e.preventDefault();
        openConnectModal();
    }
    
    const handleDisconnect = (e) => {
        e.preventDefault();
        disconnect();
    }

    const handleSwitchChain = (e) => {
        e.preventDefault();
        switchNetwork?.(SUPPORTED_CHAIN_ID);
        if(error) { 
            toast.error(error.message)
        }
    }
 
    return (
        <> 
        <nav className="navbar navbar-expand-lg d-flex flex-row justify-content-between align-items-center gap-3">
            <Link className="navbar-brand me-1 fw-bold fs-3" title="EnsOcean" to="/">
                <img src={logo} alt="EnsOcean" className="align-text-top me-1" />
                EnsOcean
            </Link>
            <div className="d-flex flex-row justify-content-end align-items-center gap-2 d-lg-none">         
                <div className="d-flex flex-row gap-2">
                    <GasPriceButton />
                    <ConnectButton smallButton={true} />
                </div>
                <button className="navbar-toggler p-1" type="button" onClick={(e)=> handleShow()}>
                    <span className="navbar-toggler-icon"></span>
                    <small className="position-absolute translate-middle badge rounded-pill bg-danger">
                        <Numeral value={totalRegisterlistItems + totalWatchlistItems} format={"0,0"} />
                    </small>
                </button>
            </div>  
            <div className="flex-fill d-none d-lg-block d-flex flex-row justify-content-between">
                <div className="d-flex flex-row justify-content-between">
                    <div className="flex-grow-1 d-flex flex-row justify-content-start gap-3">
                        <div className="w-50">
                            <AutoComplete />  
                        </div>
                        <ul className="list-unstyled m-0 d-flex flex-row justify-content-start gap-2 align-items-center ">
                            <li>
                                <Link onClick={ handleClose } className="nav-link fw-bold" to="/find">Find</Link>
                            </li> 
                            <li>
                                <Link onClick={ handleClose } className="nav-link fw-bold" to="/discover">Browse</Link>
                            </li> 
                        </ul> 
                    </div>
                    <div className="d-flex flex-row justify-content-end">
                        <ul className="list-unstyled d-flex flex-row justify-content-end gap-2 align-items-center m-0">
                            <li> <GasPriceButton /></li>
                            <li> 
                                { SUPPORTED_CHAIN_ID !== chain?.id ? 
                                <OverlayTrigger placement="top"  overlay={<Tooltip>Wrong Network! Click to Change Network</Tooltip>} >
                                    <button className={"btn btn-danger"} disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
                                    {isLoading && pendingChainId === SUPPORTED_CHAIN_ID && <Spinner animation="border" variant="white" size="sm" />}
                                    <span> Wrong Network</span>
                                    </button> 
                                </OverlayTrigger>
                                : <button className={"btn btn-outline-primary"} onClick={handleShow}>
                                    {obscureAddress(address)}
                                    <small className="position-absolute top-0 start-75 badge rounded-pill bg-danger">
                                        <Numeral value={totalRegisterlistItems + totalWatchlistItems} format={"0,0"} />
                                    </small>
                                    </button>
                                }
                            </li>
                        </ul> 
                    </div>
                </div> 
            </div>
            <Offcanvas show={show} onHide={handleClose} placement="end" className="flex-grow-1">
                <Offcanvas.Header closeButton>
                    <a className="navbar-brand" title="EnsOcean" href="/">
                        <img src={logo} alt="EnsOcean" className="align-text-top me-1" />
                    </a>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <AutoComplete />  
                    <ul className="list-unstyled d-flex flex-column justify-content-start align-items-start gap-3 mt-3">
                        <li>
                            <Link onClick={ handleClose } className="nav-link fw-bold" to="/find">Find</Link>
                        </li> 
                        <li>
                            <Link onClick={ handleClose } className="nav-link fw-bold" to="/discover">Browse</Link>
                        </li> 
                        {isConnected && 
                            <li>
                                <Link onClick={ handleClose } className="nav-link fw-bold" title={"My Portfolio"} to={"/account/"+ address }> 
                                    My Domains
                                </Link> 
                            </li>
                        }
                        {isConnected && 
                            <li>
                                <Link onClick={ handleClose } className="nav-link fw-bold" title={"My Watchlist"} to={"/account/"+ address +"?tab=watchlist"}>
                                    Watchlist {" "}
                                    <small className="translate-middle ms-2 badge rounded-pill bg-danger">
                                        <Numeral value={totalWatchlistItems} format={"0,0"} />
                                    </small>
                                </Link> 
                            </li>
                        }
                        <li>
                            <Link onClick={ handleClose }  className={"btn btn-default position-relative nav-link fw-bold"}  to="/register">
                                BulkRegister
    
                                {totalRegisterlistItems > 0 && 
                                    <small className="position-absolute ms-2 translate-middle badge rounded-pill bg-danger">
                                        <Numeral value={totalRegisterlistItems} format={"0,0"} />
                                    </small>
                                }
                            </Link>
                        </li>
                        <li>
                            <ConnectButton />
                        </li>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </nav> 
        </>
    )
}

export default Navbar;