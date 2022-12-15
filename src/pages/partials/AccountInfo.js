import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import { getTokenId, obscureAddress } from "../../helpers/String"; 
import notAvailable from "../../assets/not-available.svg";
import spinner from '../../assets/spinner.svg'
import clipboardIcon from '../../assets/clipboard-white.svg'
import shareIcon from '../../assets/share-light.svg'
import etherscanIcon from '../../assets/etherscan.svg'
import x2y2Icon from "../../assets/x2y2.svg";
import raribleIcon from "../../assets/rarible.svg";
import looksrareIcon from "../../assets/looksrare.svg";
import openseaIcon from "../../assets/opensea2.svg";
import listIcon from "../../assets/list-white.svg";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useContractRead } from "wagmi";
import reverseLookupAbi from "../../abis/ReverseLookup.json";
import { Spinner } from "react-bootstrap";

const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;

const AccountInfo = ({  }) => {
    const addr = useParams().address;  
     
    const { data, isFetching } = useContractRead({
        addressOrName: process.env.REACT_APP_REVERSE_LOOKUP_ADDRESS,
        contractInterface: reverseLookupAbi,
        functionName: "getNames",
        args: [[addr]]
    });  
    
    if(isFetching) return (
        <div className="d-flex placeholder-glow">
                    <div className="flex-shrink-0">
                        <div className="card h-100">
                            <span className="placeholder col-12" style={ { width: 125, height:125 } }></span>
                        </div>
                    </div>
                    <div className="flex-grow-1 ms-3 d-flex flex-column align-items-start">
                        <span className="placeholder col-4"></span>
                        <div className="d-flex flex-row mt-3">
                            <span className="placeholder col-3"></span>
                        </div>
                    </div>
            </div>
    )
    
    if(!isFetching && data) {
        const primaryName = data[0];
        return (
            <div className="d-flex">
                <div className="flex-shrink-0">
                    <div className="card text-start">
                        <LazyLoadImage
                            alt={addr} 
                            className="img-fluid card-img-top card-img-bottom"
                            onError={(e)=> { document.getElementById(addr)?.remove(); e.target.src = notAvailable; e.target.alt="Not available" }}
                            afterLoad={(e)=> { document.getElementById(addr)?.remove(); }}
                            placeholder={<img src={spinner} width={125} height={125} className="img-fluid card-img-top card-img-bottom" alt="" />}
                            placeholderSrc={spinner} 
                            width={125} 
                            height={125}
                            src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(primaryName.replace(".eth", ""))) }
                            />  
                        <img id={addr} width={125} height={125} src={spinner} className="img-fluid card-img-top card-img-bottom position-absolute top-0 start-0" alt="" />
                    </div>
                </div>
                <div className="flex-grow-1 ms-3 d-flex flex-column align-items-start">
                    <h2>{primaryName || obscureAddress(addr)}</h2>
                    <div className="d-flex gap-3">
                        <CopyToClipboard text={addr} onCopy={() => toast.success("Address copied") }>
                            <a href="#">
                                <img src={clipboardIcon} width={20} height={20} alt="" />
                            </a>
                        </CopyToClipboard>
                        <CopyToClipboard text={window.location.href} onCopy={() => toast.success("Link copied") }>
                            <a href="#">
                                <img src={shareIcon} width={20} height={20} alt="" />
                            </a>
                        </CopyToClipboard>
                        <a target="_blank" rel="noreferrer" href={"https://etherscan.io/address/"+ addr} title="View on Etherscan" data-bs-toogle="tooltip" data-bs-title="View on etherscan.io" className='text-white'>
                            <img src={etherscanIcon} width={20} height={20} alt="" />
                        </a>
                        <a target="_blank" rel="noreferrer" href={"https://opensea.io/"+ addr}>
                            <img src={openseaIcon}  width={24} height={24} alt="" />
                        </a>
                        
                        <div className="dropdown p-0">
                            <a className="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={listIcon}  width={22} height={22} alt="" />
                            </a> 
                            <ul className="dropdown-menu">
                                <li className="p-0">
                                    <a className="dropdown-item" target="_blank" rel="noreferrer" href={"https://x2y2.io/user/"+ addr}>
                                        <img src={x2y2Icon}  width={20} height={20} alt="" /> X2y2
                                    </a>
                                </li>
                                <li className="p-0">
                                    <a className="dropdown-item" target="_blank" rel="noreferrer" href={"https://rarible.com/user/"+ addr}>
                                        <img src={raribleIcon}  width={20} height={20} alt="" /> Rarible
                                    </a>
                                </li>
                                <li className="p-0">
                                    <a className="dropdown-item" target="_blank" rel="noreferrer" href={"https://looksrare.org/accounts/"+ addr}>
                                        <img src={looksrareIcon}  width={20} height={20} alt="" /> Looksrare
                                    </a>    
                                </li>
                            </ul>
                        </div> 
                    </div>
                </div>
            </div>
        )
    }
    
}

export default AccountInfo;

            