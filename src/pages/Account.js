import {Helmet} from "react-helmet-async"; 
import { useLocation, useNavigate, useParams } from "react-router-dom"; 
import Filter from "./partials/Filter"; 
import AccountInfo from "./partials/AccountInfo";
import AccountTabs from "./partials/AccountTabs";
import { useWatchlist } from "react-use-watchlist";
import { useAccount } from "wagmi"; 
import { Trash } from "react-bootstrap-icons";
import { Button, Container, Modal } from "react-bootstrap";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Account = () => {
    const addr = useParams().address;  
    const { isConnected } = useAccount();   
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const {items, totalUniqueItems, removeItem} = useWatchlist();   
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClearList = () => {
        items.forEach((item)=> {
            removeItem(item.id);
        })
        handleClose();
        navigate(0);
    } 
 
    return (
      <>
        <Helmet> 
            <title>{addr} - EnsOcean</title>
            <meta name="description" content={"See which ENS domains does the account ("+ addr +") have."} />
        </Helmet>
        <Container className="bg-primary bg-gradient" fluid>
            <Container className="pt-4 pb-4 text-white" fluid>
                <AccountInfo />
            </Container>
        </Container>
        <Container className="p-0 m-0" fluid>
            {isConnected && totalUniqueItems > 0 &&
                <div className="d-flex flex-row justify-content-end align-items-center gap-3 pt-3 pe-3">    
                    <Button variant="primary"  onClick={handleShow}> 
                        <Trash /> Clear Watchlist
                    </Button>
                </div>
            }
            <Container className="p-2" fluid>
                <AccountTabs account={addr} tab="" />
            </Container>
            <Container className="ps-3 pe-3" fluid>
                {(tab === "" || tab === null) &&  
                    <Filter First={100} Skip={0} OrderBy={"registered"} OrderDirection={"desc"} Where={{
                    label_not: null, 
                    owner: addr.toLowerCase()
                    }} />} 
                {tab === "watchlist" &&
                <>
                    {isConnected  &&
                        <Filter First={100} Skip={0} Tab={"watchlist"} OrderBy={"expires"} OrderDirection={"desc"} Where={{
                            label_not:null, 
                            id_in: items.map(t=> t.id) 
                        }} View="gallery" />}

                    {!isConnected  &&
                        <div className="d-flex flex-row justify-content-center">
                            <ConnectButton />
                        </div>
                    } 
                </> 
                }
            </Container>
        </Container>
        <Modal backdrop={true} centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure want to clear?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="danger" onClick={handleClearList}>
                Continue
            </Button>
            </Modal.Footer>
        </Modal>
      </> 
    );
};
  
export default Account;