import {Helmet} from "react-helmet-async"; 
import { useLocation, useNavigate, useParams } from "react-router-dom"; 
import Filter from "./partials/Filter"; 
import AccountInfo from "./partials/AccountInfo";
import AccountTabs from "./partials/AccountTabs";
import { useWatchlist } from "react-use-watchlist";
import { useAccount } from "wagmi"; 
import { Trash } from "react-bootstrap-icons";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

const Account = () => {
    const addr = useParams().address;  
    const { isConnected, address } = useAccount();   
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
      <div className="container-fluid bg-primary">
        <div className="container-fluid container-fluid pt-4 pb-4 text-white">
            <AccountInfo />
        </div>
      </div>
      <div className="container-fluid p-0 m-0"> 
            <div className="d-flex flex-row justify-content-end align-items-center gap-3 p-2">        
                {totalUniqueItems &&
                <button className="btn btn-primary" onClick={handleShow}> <Trash /> Clear Watchlist</button>
                }
            </div>
            <div className="container-fluid p-2">
                <AccountTabs account={addr} tab="" />
            </div>
            <div className="container-fluid">
                {(tab === "" || tab === null) &&  
                <Filter First={100} Skip={0} OrderBy={"created"} OrderDirection={"desc"} Where={{
                    label_not: null, 
                    owner: addr.toLowerCase()
                }} />} 
                {tab === "watchlist" && isConnected && address === addr &&
                <Filter First={100} Skip={0} Tab={"watchlist"} OrderBy={"expires"} OrderDirection={"desc"} Where={{
                        label_not:null, 
                        id_in: items.map(t=> t.id) 
                }} View="gallery" />}
            </div>
      </div>  

      <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure want to delete all?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleClearList}>
                Clear All
            </Button>
            </Modal.Footer>
        </Modal>
      </> 
    );
};
  
export default Account;