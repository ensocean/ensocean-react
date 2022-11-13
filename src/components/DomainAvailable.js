import React  from "react";
import EnsControllerAbi from '../abis/EthRegistrarController.json'
import { ethers } from 'ethers'
import { getLength, getSegmentLength, getTokenId, isValidName, obscureLabel } from "../helpers/String";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CopyToClipboard} from 'react-copy-to-clipboard'; 
import DomainLoading from "./DomainLoading";

const ETHEREUM_RPC_URL = process.env.REACT_APP_ETHEREUM_RPC_URL; 
const ENS_CONTROLLER_ADDRESS = process.env.REACT_APP_ENS_CONTROLLER_ADDRESS; 

class DomainAvailable extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        available: false 
      };
    }

    componentDidMount() { 
        const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL);
        const contract = new ethers.Contract(ENS_CONTROLLER_ADDRESS, EnsControllerAbi, provider);
       // contract.available(this.props.label).then((res) => {
         //   this.setState({ available: res });
        //});  
  
    } 

    render() { 
        if(this.state.available == null) {
            return (<DomainLoading label={this.props.label} />)  
        } else {
            return ( 
                <>
                    <div className="container-fluid bg-primary mb-4">
                        <div className="container p-3 text-white">
                            <div className='d-flex justify-content-between align-items-center'> 
                                <div className='d-flex justify-content-start align-items-center gap-3'>
                                    <h1 className='m-auto'>{obscureLabel(this.props.label, 20)}.eth</h1>
                                </div> 
                                <div className='d-flex align-items-center gap-3'> 
                                    <CopyToClipboard text={window.location.href}
                                        onCopy={() => toast.success("Link Copied") }>
                                        <span className='cursor-pointer' >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
                                            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                                            </svg>
                                        </span>
                                    </CopyToClipboard>
                                    <span className='cursor-pointer'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                        </svg>
                                    </span> 
                                </div> 
                            </div>
                        </div> 
                    </div>
                    <div className='container-fluid'> 
                        <div className='container'>
                            <div className="card mb-3 border-light border-0">
                                <div className="row g-0"> 
                                    <div className="col-lg-5">
                                        <div className='img-container img-fluid p-0 m-0 img-thumbnail border-1 shadow-sm border-warning d-inline-flex align-items-center img-responsive'>
                                            <div className='text-center m-auto'>
                                                <h2 className='text-white fs-1'>{obscureLabel(this.props.label, 25)}.eth</h2>
                                            </div> 
                                        </div> 
                                    </div>
                                    <div className='col-lg-7'>
                                        <div className="card-body">  
                                            {this.state.available === true && 
                                                <div className="alert alert-success">Name available for registration!</div>
                                            }
                                            {this.state.available === false && 
                                                <div className="alert alert-danger">Name is not available for registration!</div>
                                            }  
                                            { isValidName(this.props.label) === false &&
                                                <div className="alert alert-danger">Malformed!</div>
                                            }
                                            <h5 className="card-title fs-4">Details</h5>
                                            <hr />
                                            <ul className='list-group list-group-flush'>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Owner: </span> <span className='float-end'>-</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Tags </span> <span className='float-end'>-</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                <CopyToClipboard text={getTokenId(this.props.label)}
                                                    onCopy={() => toast.success("TokenId Copied") }>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard fs-6 float-end cursor-pointer" viewBox="0 0 16 16">
                                                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                                    </svg>
                                                </CopyToClipboard> 
                                                <span className='fw-bold fs-6 text-muted'>Token ID </span> <span className='float-end'>{obscureLabel(getTokenId(this.props.label), 25)}</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Length </span> <span className='float-end'>{getLength(this.props.label)}</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Segment Length </span> <span className='float-end'>{getSegmentLength(this.props.label)}</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Created Date </span> <span className='float-end'>-</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Registered Date </span> <span className='float-end'>-</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Expires Date </span> <span className='float-end'>-</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </> 
          );
        } 
    }
}

export default DomainAvailable;