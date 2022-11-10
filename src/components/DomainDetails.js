import React from "react"; 
import {  getTokenId, obscureAddress, obscureLabel } from "../helpers/String";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import spinner from '../assets/spinner.svg'
import { Link } from "react-router-dom";
import moment from "moment";
import DomainEvents from "../pages/partials/DomainEvents";
 
const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;
const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_URL;

class DomainDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        available: null 
      };
    }

    componentDidMount() { 
        
    } 

    render() {
      return ( 
            <>
                <div className="container-fluid bg-primary mb-4">
                    <div className="container p-3 text-white">
                        <div className='d-flex justify-content-between align-items-center'> 
                            <div className='d-flex justify-content-start align-items-center gap-3 text-sm'>
                                <h1 className='m-auto display-6'>{obscureLabel(this.props.domain.name, 25)}</h1>
                                <a target="_blank" rel="noreferrer" href={ ETHERSCAN_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(this.props.domain.label))} title="View on Etherscan" data-bs-toogle="tooltip" data-bs-title="asklfdja" className='text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 293.775 293.667" width="26" height="26"><path data-name="Path 1" d="M61.055 139.819a12.45 12.45 0 0 1 12.508-12.452l20.737.068a12.467 12.467 0 0 1 12.467 12.467v78.414c2.336-.692 5.332-1.43 8.614-2.2a10.389 10.389 0 0 0 8.009-10.11V108.74a12.469 12.469 0 0 1 12.467-12.47h20.779a12.47 12.47 0 0 1 12.467 12.47v90.276s5.2-2.106 10.269-4.245a10.408 10.408 0 0 0 6.353-9.577V77.567A12.466 12.466 0 0 1 198.19 65.1h20.779a12.468 12.468 0 0 1 12.468 12.467v88.625c18.014-13.055 36.271-28.758 50.759-47.639a20.926 20.926 0 0 0 3.185-19.537A146.6 146.6 0 0 0 148.737.01C67.298-1.084-.007 65.395.001 146.844a146.371 146.371 0 0 0 19.5 73.45 18.56 18.56 0 0 0 17.707 9.173 508.86 508.86 0 0 0 14.643-1.518 10.383 10.383 0 0 0 9.209-10.306v-77.824" fill="#fff"></path><path data-name="Path 2" d="M60.603 265.577a146.808 146.808 0 0 0 233.172-118.741c0-3.381-.157-6.724-.383-10.049-53.642 80-152.686 117.405-232.79 128.793" fill="#bfcfda"></path></svg>
                                </a>
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
                                <div className="col-lg-4"> 
                                        <div className='img-thumbnail border border-3 d-flex justify-content-center align-items-center'>
                                            <LazyLoadImage
                                                alt={this.props.domain.name} 
                                                className="img-responsive"
                                                onError={(e)=> { e.target.style.display = "none" }}
                                                placeholderSrc={spinner}
                                                visibleByDefault={false}
                                                src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(this.props.domain.label)) }
                                                />
                                             { /* <h2 className="display-8 text-white">{obscureLabel(this.props.domain.label, 20)}.{this.props.domain.extension}</h2>*/ }
                                        </div>  
                                </div>
                                <div className='col-lg-8'>
                                    <div className="card-body m-0 m-lg-1 m-md-1 m-sm-0"> 
                                        <h5 className="card-title fs-4">Details</h5>
                                        <hr />
                                        <ul className='list-group list-group-flush'>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className='fw-bold fs-6 text-muted'>Owner: </span> <span className='float-end'><Link to={"/account/"+ this.props.domain.owner }>{obscureAddress(this.props.domain.owner)}</Link> </span>
                                            </li>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className='fw-bold fs-6 text-muted'>Tags </span> <span className='float-end'>{this.props.domain.tags.join(", ")}</span>
                                            </li>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                            <CopyToClipboard text={getTokenId(this.props.domain.label)}
                                                onCopy={() => toast.success("TokenId Copied") }>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard fs-6 float-end cursor-pointer" viewBox="0 0 16 16">
                                                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                                </svg>
                                            </CopyToClipboard> 
                                            <span className='fw-bold fs-6 text-muted'>Token ID </span> <span className='float-end me-2'>{obscureAddress(getTokenId(this.props.domain.label), 25)}</span>
                                            </li>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className='fw-bold fs-6 text-muted'>Length </span> <span className='float-end'>{this.props.domain.length}</span>
                                            </li>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className='fw-bold fs-6 text-muted'>Segment Length </span> <span className='float-end'>{this.props.domain.segmentLength}</span>
                                            </li>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className='fw-bold fs-6 text-muted'>Created Date </span> <span className='float-end'>{moment.unix(this.props.domain.created).toDate().toDateString()}</span>
                                            </li>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className='fw-bold fs-6 text-muted'>Registered Date </span> <span className='float-end'>{moment.unix(this.props.domain.registered).toDate().toDateString()}</span>
                                            </li>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className='fw-bold fs-6 text-muted'>Expires Date </span> <span className='float-end'>{moment.unix(this.props.domain.expires).toDate().toDateString()}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container'> 
                        <DomainEvents id={this.props.domain.id} />
                    </div>
                </div>
            </> 
      );
    }
}

export default DomainDetails;