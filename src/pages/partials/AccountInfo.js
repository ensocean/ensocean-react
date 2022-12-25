import { useParams } from "react-router-dom";
import { obscureAddress, obscureEnsName } from "../../helpers/String"; 
import etherscanIcon from '../../assets/etherscan.svg'
import x2y2Icon from "../../assets/x2y2.svg";
import raribleIcon from "../../assets/rarible.svg";
import looksrareIcon from "../../assets/looksrare.svg";
import openseaIcon from "../../assets/opensea2.svg"; 
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useEnsName } from "wagmi";
import { Clipboard, List, Share } from "react-bootstrap-icons";
import AccountAvatar from "../../components/AccountAvatar";

const AccountInfo = () => {
    const { address } = useParams();  
    const { data: ensName, isFetching, isFetched } = useEnsName({address, staleTime: 2_000, cacheTime: 2_000 });
       
    if(isFetching) 
    {
        return (
            <div className="d-flex placeholder-glow">
                <div className="flex-shrink-0">
                    <div className="card placeholder-glow  mb-2" style={{width:100, height:100}}>
                        <span className="placeholder col-12 w-100 h-100 "></span>
                    </div>
                </div>
                <div className="flex-grow-1 ms-3 text-truncate">
                    <span className="text-truncate placeholder col-4"></span> 
                    <div className="d-flex gap-3">
                        <span className="placeholder col-3"></span>
                    </div>
                </div>
            </div>
        )
    } 
  
    if(isFetched) {
        return (
            <div className="d-flex">
                <div className="flex-shrink-0">
                    <div className="card mb-2">
                        <AccountAvatar ensName={ensName ? ensName : ""} />
                    </div>
                </div>
                <div className="flex-grow-1 ms-3">
                    <h1 className="text-truncate">{ensName ? obscureEnsName(ensName) : obscureAddress(address)}</h1>
                    <div className="d-flex gap-3">
                        <CopyToClipboard text={address} onCopy={() => toast.success("Address copied") }>
                            <span rule="button">
                                <Clipboard className="text-white" />
                            </span>
                        </CopyToClipboard>
                        <CopyToClipboard text={window.location.href} onCopy={() => toast.success("Link copied") }>
                            <span rule="button">
                                <Share className="text-white" />
                            </span>
                        </CopyToClipboard>
                        <a target="_blank" rel="noreferrer" href={"https://etherscan.io/address/"+ address} title="View on Etherscan" data-bs-toogle="tooltip" data-bs-title="View on etherscan.io" className='text-white'>
                            <img src={etherscanIcon} width={20} height={20} alt="" />
                        </a>
                        <a target="_blank" rel="noreferrer" href={"https://opensea.io/"+ address}>
                            <img src={openseaIcon}  width={24} height={24} alt="" />
                        </a> 
                        <div className="dropdown p-0">
                            <span role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <List width={24} height={24} />
                            </span> 
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
        )
    } 
}

export default AccountInfo;

            