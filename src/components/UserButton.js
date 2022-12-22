



import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react"; 
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { Wallet } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { obscureAddress } from "../helpers/String";

function UserButton() {   
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork()
    const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { openConnectModal } = useConnectModal(); 
    const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);

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
            {isConnected && 
                <>
                    { SUPPORTED_CHAIN_ID !== chain?.id ? 
                        <OverlayTrigger placement="top"  overlay={<Tooltip>Wrong Network! Click to Change Network</Tooltip>} >
                            <button className={"btn btn-danger"} disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
                                {isLoading && pendingChainId === SUPPORTED_CHAIN_ID && <Spinner animation="border" variant="white" size="sm" />}
                                <span> Wrong Network</span>
                            </button> 
                        </OverlayTrigger>
                    : 
                        <Link className={"text-decoration-none"} to={"/account/"+ address}>
                            <Wallet /> {" "}
                            {obscureAddress(address)} 
                        </Link>
                    }
                </>
            }

            {!isConnected && 
                <button className={"btn btn-primary"} onClick={openConnectModal}>
                    Connect Wallet
                </button>
            }
         </>
    ) 
}

export default UserButton;




