import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import { getTokenId, obscureAddress } from "../../helpers/String"; 
import notAvailable from "../../assets/not-available.svg";
import spinner from '../../assets/spinner.svg' 
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
import { useRef } from "react";
import { Clipboard, Share } from "react-bootstrap-icons";

const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;

const AccountInfo = ({  }) => {
    const addr = useParams().address;  
    const imgRef = useRef();

    const { data, isFetching } = useContractRead({
        addressOrName: process.env.REACT_APP_REVERSE_LOOKUP_ADDRESS,
        contractInterface: reverseLookupAbi,
        functionName: "getNames",
        args: [[addr]]
    });  
    
    if(isFetching) return (
        <div class="row placeholder-glow">
            <div class="col-2 col-lg-1 text-end">
                    <div className="card mb-2 h-100">
                    <span className="placeholder col-12 w-100" style={{width:100, height:100}}></span>
                </div>
            </div>
            <div class="col-10 col-lg-11 ps-0">
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
            <div class="d-flex">
                <div class="flex-shrink-0">
                    <div className="card mb-2">
                        <LazyLoadImage 
                            alt={addr} 
                            className="img-fluid card-img-top card-img-bottom rounded-1"
                            onError={(e)=> { imgRef.current.classList.add("d-none"); e.target.src = notAvailable; e.target.alt="Not available" }}
                            afterLoad={(e)=> { imgRef.current.classList.add("d-none")  }}
                            placeholder={<img src={spinner} width={100} height={100} className="img-fluid card-img-top card-img-bottom" alt="" />}
                            placeholderSrc={spinner} 
                            width={100} 
                            height={100}
                            src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(primaryName.replace(".eth", ""))) }
                            />  
                        <img ref={imgRef} id={addr} width={100} height={100} src={spinner} className="img-fluid card-img-top card-img-bottom position-absolute top-0 start-0" alt="" />
                    </div>
                </div>
                <div class="flex-grow-1 ms-3 text-truncate">
                    <h2 className="text-truncate">{primaryName || obscureAddress(addr)}</h2>
                    <div className="d-flex gap-3">
                        <CopyToClipboard text={addr} onCopy={() => toast.success("Address copied") }>
                            <a href="#">
                                <Clipboard className="text-white" />
                            </a>
                        </CopyToClipboard>
                        <CopyToClipboard text={window.location.href} onCopy={() => toast.success("Link copied") }>
                            <a href="#">
                                <Share className="text-white" />
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

            