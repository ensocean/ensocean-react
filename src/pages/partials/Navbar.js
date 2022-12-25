import ConnectButton from "../../components/ConnectButton";
import AutoComplete from "../../components/AutoComplete";
import BasketButton from "../../components/BasketButton"; 
import { useAccount, useNetwork, useSwitchNetwork, useEnsName, useEnsAvatar } from 'wagmi';
import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";
import { useWatchlist } from "react-use-watchlist";
import Numeral from "react-numeral";
import GasPriceButton from "../../components/GasPriceButton";
import WatchlistButton from "../../components/WatchlistButton";
import { useRegisterlist } from "react-use-registerlist";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { Dropdown, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { obscureAddress, obscureEnsName } from "../../helpers/String";
import { Clipboard, Wallet } from "react-bootstrap-icons";
import CopyToClipboard from "react-copy-to-clipboard";
import Logo from "../../components/Logo";
import avatar from "../../assets/avatar.svg";

const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);

const Navbar = () => {   
    const { isConnected, address } = useAccount();   
    const  totalRegisterlistItems = useRegisterlist().totalUniqueItems;
    const  totalWatchlistItems = useWatchlist().totalUniqueItems;
    const { chain } = useNetwork();
    const { data: ensName } = useEnsName({ address, staleTime: 2_000, cacheTime: 2_000 });
    const { data: ensAvatar } = useEnsAvatar({ address, staleTime: 2_000, cacheTime: 2_000 });
    const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { openConnectModal } = useConnectModal(); 
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleConnect = (e) => {
        e.preventDefault();
        openConnectModal();
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
            <Logo />
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
                        <div style={{ width: "60%" }}>
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
                        <ul className="list-unstyled d-flex flex-row justify-content-end gap-3 align-items-center m-0 fw-bold">
                            <li> 
                                <GasPriceButton />
                            </li>
                            <li> 
                                {isConnected && 
                                    <>
                                        { SUPPORTED_CHAIN_ID !== chain?.id ? 
                                            <OverlayTrigger placement="top"  overlay={<Tooltip>Wrong Network! Click to Change Network</Tooltip>} >
                                                <button className={"btn btn-danger"} disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
                                                {isLoading && pendingChainId === SUPPORTED_CHAIN_ID && <Spinner animation="border" variant="white" size="sm" />}
                                                <span> Wrong Network</span>
                                                </button> 
                                            </OverlayTrigger>
                                        : <Link className={"text-decoration-none d-flex flex-row align-items-center gap-1"} onClick={handleShow}>
                                            <img src={ensAvatar ? ensAvatar : avatar } alt={address} width={32} height={32} className="img-fluid rounded-circle" />
                                            {ensName ? `${obscureEnsName(ensName)}` : obscureAddress(address)}
                                          </Link>
                                        }
                                    </>
                                }
                                
                                {!isConnected && 
                                  <button className={"btn btn-primary"} onClick={handleConnect}>
                                    Connect Wallet
                                  </button>
                                }
                            </li>
                        </ul> 
                    </div>
                </div> 
            </div>
            <Offcanvas show={show} onHide={handleClose} placement="end" className="flex-grow-1">
                <Offcanvas.Header closeButton>
                    <Logo />
                </Offcanvas.Header>
                <Offcanvas.Body className="pt-0">
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
                        <li> 
                            <Link onClick={ isConnected ? handleClose: handleConnect } className="nav-link fw-bold" title={"My Watchlist"} to={"/account/"+ address +"?tab=watchlist"}>
                                Watchlist {" "}
                                <small className="translate-middle ms-2 badge rounded-pill bg-danger">
                                    <Numeral value={totalWatchlistItems} format={"0,0"} />
                                </small>
                            </Link> 
                        </li> 
                        <li>
                            <Link onClick={ handleClose }  className={"btn btn-default position-relative nav-link fw-bold"}  to="/register">
                                Bulk Registration 
                                {totalRegisterlistItems > 0 && 
                                    <small className="position-absolute ms-2 translate-middle badge rounded-pill bg-danger">
                                        <Numeral value={totalRegisterlistItems} format={"0,0"} />
                                    </small>
                                }
                            </Link>
                        </li>
                        <li className="divider w-100 p-0 m-0" >
                            <hr className="p-0 m-0" />
                        </li>
                        <li className="w-100 d-flex flex-row gap-2 align-items-center justify-content-between">
                            {isConnected &&
                                <Dropdown>
                                    <Dropdown.Toggle variant="default" className="p-0">
                                        <span className="fw-bold">{ensName ? obscureEnsName(ensName): obscureAddress(address)}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="p-0">
                                        {ensName &&
                                        <Dropdown.Item className="p-2">
                                            <CopyToClipboard text={ensName} onCopy={() => toast.success("Name copied") }>
                                                <span rule="button" className="d-flex flex-row gap-2 justify-content-between align-items-center ">
                                                    {obscureEnsName(ensName)}
                                                    <Clipboard />
                                                </span>
                                            </CopyToClipboard>
                                        </Dropdown.Item>
                                        }
                                        <Dropdown.Item rule="button" className="p-2">
                                            <CopyToClipboard text={address} onCopy={() => toast.success("Address copied") }>
                                                <span rule="button" className="d-flex flex-row gap-2 justify-content-between align-items-center ">
                                                    {obscureAddress(address)}
                                                    <Clipboard />
                                                </span>
                                            </CopyToClipboard>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
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