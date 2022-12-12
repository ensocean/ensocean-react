import {Helmet} from "react-helmet";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import { obscureAddress } from "../helpers/String";
import Filter from "./partials/Filter";
import notAvailable from "../assets/not-available.svg";
import spinner from '../assets/spinner.svg'
import clipboardIcon from '../assets/clipboard-white.svg'
import shareIcon from '../assets/share-light.svg'
import etherscanIcon from '../assets/etherscan.svg'
import x2y2Icon from "../assets/x2y2.svg";
import raribleIcon from "../assets/rarible.svg";
import looksrareIcon from "../assets/looksrare.svg";
import openseaIcon from "../assets/opensea2.svg";
import listIcon from "../assets/list-white.svg";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const Account = () => {
    const { address } = useParams();  
    let where = { label_not: null, owner_starts_with_nocase: address }; 
 
    return (
      <>
      <Helmet> 
          <title>{address} - EnsOcean</title>
          <meta name="description" content={"See which ENS domains does the account ("+ address +") have."} />
      </Helmet>
      <div className="container-fluid bg-primary">
        <div className="container-fluid container-fluid p-0 pt-4 pb-4 text-white">
            <div className="d-flex">
                <div className="flex-shrink-0">
                    <div className="card text-start">
                    <LazyLoadImage
                        alt={address} 
                        className="img-fluid img-thumbnail card-img-top card-img-bottom"
                        onError={(e)=> { e.target.src = notAvailable; }}
                        placeholder={<img src={spinner} className="img-fluid img-thumbnail card-img-top card-img-bottom" alt="" />}
                        placeholderSrc={spinner}
                        visibleByDefault={false}
                        width={125} 
                        src={notAvailable}
                        />  
                    </div>
                </div>
                <div className="flex-grow-1 ms-3 d-flex flex-column align-items-start">
                    <h2>{obscureAddress(address)}</h2>
                    <div className="d-flex gap-3">
                        <CopyToClipboard text={address} onCopy={() => toast.success("Address copied") }>
                            <a href="#">
                                <img src={clipboardIcon} width={20} height={20} alt="" />
                            </a>
                        </CopyToClipboard>
                        <CopyToClipboard text={window.location.href} onCopy={() => toast.success("Link copied") }>
                            <a href="#">
                                <img src={shareIcon} width={20} height={20} alt="" />
                            </a>
                        </CopyToClipboard>
                        <a target="_blank" rel="noreferrer" href={"https://etherscan.io/address/"+ address} title="View on Etherscan" data-bs-toogle="tooltip" data-bs-title="View on etherscan.io" className='text-white'>
                            <img src={etherscanIcon} width={20} height={20} alt="" />
                        </a>
                        <a target="_blank" rel="noreferrer" href={"https://opensea.io/"+ address}>
                            <img src={openseaIcon}  width={24} height={24} alt="" />
                        </a>
                        
                        <div className="dropdown p-0">
                            <a className="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={listIcon}  width={22} height={22} alt="" />
                            </a> 
                            <ul className="dropdown-menu">
                                <li className="p-0">
                                    <a className="dropdown-item" target="_blank" rel="noreferrer" href={"https://x2y2.io/user/"+ address}>
                                        <img src={x2y2Icon}  width={20} height={20} alt="" /> X2y2
                                    </a>
                                </li>
                                <li className="p-0">
                                    <a className="dropdown-item" target="_blank" rel="noreferrer" href={"https://rarible.com/user/"+ address}>
                                        <img src={raribleIcon}  width={20} height={20} alt="" /> Rarible
                                    </a>
                                </li>
                                <li className="p-0">
                                    <a className="dropdown-item" target="_blank" rel="noreferrer" href={"https://looksrare.org/accounts/"+ address}>
                                        <img src={looksrareIcon}  width={20} height={20} alt="" /> Looksrare
                                    </a>    
                                </li>
                            </ul>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="container-fluid pt-2"> 
            <Filter First={100} Skip={0} OrderBy={"created"} OrderDirection={"desc"} Where={where} />
      </div>  
      </> 
    );
};
  
export default Account;