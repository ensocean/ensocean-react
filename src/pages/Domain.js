import React  from "react";
import { Link, useParams } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";  
import {Helmet} from "react-helmet";
import { getDateString, getLength, getSegmentLength, getTokenId, isValidName, obscureAddress, obscureLabel } from "../helpers/String";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DomainEvents from "./partials/DomainEvents";
import spinner from '../assets/spinner.svg'

const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;
const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_URL;

const DOMAIN_DETAILS = gql`
    query Domains( $label: String! ) {
        domains ( 
            where: {
                label: $label
            }
        )
        {
            id
            label
            name
            hash
            created
            registered
            expires
            owner
            registrant,
            length
            extension
            segmentLength
            tags
        }
    }
`;
 
 
const Domain = () => { 
    const { label, extension } = useParams();  
    const { data, loading, error } = useQuery(DOMAIN_DETAILS, {
        variables: { label },
    });  
 
    if(loading) {
        return (
            <>
                <div className="container-fluid bg-primary mb-4 placeholder-glow">
                    <div className="container p-3 text-white">
                        <div className='row'>
                            <div className='d-flex justify-content-between align-items-center'> 
                                <div className='d-flex justify-content-start gap-3 d-flex'>
                                    <span className="placeholder col-12"></span>
                                </div> 
                                <div className='d-flex align-items-center gap-3'> 
                                    <span className="placeholder col-12"></span>
                                </div> 
                            </div>
                        </div>
                    </div> 
                </div>
                <div className='container-fluid placeholder-glow'>
                    <div className='container'>
                        <div className="card mb-3 border-light border-0">
                            <div className="row g-0"> 
                                <div className="col-lg-5">
                                    <span className="placeholder col-12 w-100 col-12 h-100"></span>
                                </div>
                                <div className='col-lg-7'>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <span className="placeholder col-6"></span>
                                        </h5>
                                        <hr />
                                        <ul className='list-group list-group-flush'>
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className="placeholder col-12"></span>
                                            </li> 
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className="placeholder col-12"></span>
                                            </li> 
                                            <li className='list-group-item border-0 p-0 pb-3'>
                                                <span className="placeholder col-12"></span>
                                            </li> 
                                        </ul>
                                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container'> 
                        <span className="placeholder col-12"></span>
                    </div>
                </div>
            </>
        )
    } else if(error) {
        return (
            <>
                <span className='alert alert-danger'>{error.message}</span>
            </>
        )
    } else if(data.domains.length < 1) {  
        return ( 
            <>
                <div className="container-fluid bg-primary mb-4">
                        <div className="container p-3 text-white">
                            <div className='d-flex justify-content-between align-items-center'> 
                                <div className='d-flex justify-content-start align-items-center gap-3'>
                                    <h1 className='m-auto'>{obscureLabel(label, 20)}.{extension}</h1>
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
                                <div className="row"> 
                                    <div className="col-lg-4">
                                    <div className='h-100 bg-thumb'>
                                        <LazyLoadImage
                                            alt={label} 
                                            className="img-fluid h-100 w-100 border border-2"
                                            width={"100%"}
                                            height={"100%"}
                                            onError={(e)=> { e.target.style.display = "none"; e.target.parentNode.style.display = "none"; }}
                                            placeholderSrc={spinner}
                                            visibleByDefault={false}
                                            src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(label)) }
                                            />
                                    </div>  
                                    </div>
                                    <div className='col-lg-8'> 
                                            <div className="alert alert-success">Name available for registration!</div>
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
                                                <CopyToClipboard text={getTokenId(label)}
                                                    onCopy={() => toast.success("TokenId Copied") }>
                                                    <svg xmflns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard fs-6 float-end cursor-pointer" viewBox="0 0 16 16">
                                                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                                    </svg>
                                                </CopyToClipboard> 
                                                <span className='fw-bold fs-6 text-muted'>Token ID </span> <span className='float-end'>{obscureLabel(getTokenId(label), 25)}</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Length </span> <span className='float-end'>{getLength(label)}</span>
                                                </li>
                                                <li className='list-group-item border-0 p-0 pb-3'>
                                                    <span className='fw-bold fs-6 text-muted'>Segment Length </span> <span className='float-end'>{getSegmentLength(label)}</span>
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
            </>
        )
    } else {
        const domain = data.domains[0]; 
        return (
        <> 
            <Helmet> 
              <title>{domain.name} - EnsOcean</title>
              <meta name="description" content="{domain.name}" />
            </Helmet> 
            <div className="container-fluid bg-primary mb-4">
                    <div className="container p-3 text-white">
                        <div className='d-flex justify-content-between align-items-center'> 
                            <div className='d-flex justify-content-start align-items-center gap-3 text-sm'>
                                <h1 className='m-auto display-6'>
                                    {obscureLabel(domain.label, 25)}.{domain.extension || "eth"}
                                    { (domain.tags.includes("include-unicode") || domain.tags.includes("only-unicode")) && 
                                        <span data-bs-toogle="tooltip" data-bs-title="Include unicode characters">
                                            &nbsp;
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle text-warning" viewBox="0 0 16 16">
                                                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                                                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                                            </svg>
                                        </span>
                                    } 
                                    { !isValidName(domain.label) && 
                                        <span data-bs-toogle="tooltip" data-bs-title="This domain is malformed!">
                                            &nbsp;
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle text-danger" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                            </svg>
                                        </span>
                                    }
                                </h1>
                                <a target="_blank" rel="noreferrer" href={ ETHERSCAN_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label))} title="View on Etherscan" data-bs-toogle="tooltip" data-bs-title="asklfdja" className='text-white'>
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
                        <div className="row"> 
                            <div className="col-lg-4"> 
                                <div className='h-100 bg-thumb'>
                                    <LazyLoadImage
                                        alt={domain.name} 
                                        className="img-fluid h-100 w-100 border border-2"
                                        width={"100%"}
                                        height={"100%"}
                                        onError={(e)=> { e.target.style.display = "none"; e.target.parentNode.style.display = "none"; }}
                                        placeholderSrc={spinner}
                                        visibleByDefault={false}
                                        src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label)) }
                                        /> 
                                </div>  
                            </div>
                            <div className='col-lg-8 mt-3 mt-lg-0'>
                                <div className="card-body m-0 m-lg-1 m-md-1 m-sm-0"> 
                                    { isValidName(domain.label) === false &&
                                            <div className="alert alert-danger">Malformed!</div>
                                    }
                                    <h5 className="card-title fs-4">Details</h5>
                                    <hr />
                                    <ul className='list-group list-group-flush'>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                            <span className='fw-bold fs-6 text-muted'>Owner: </span> <span className='float-end'><Link to={"/account/"+ domain.owner }>{obscureAddress(domain.owner)}</Link> </span>
                                        </li>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                            <span className='fw-bold fs-6 text-muted'>Tags </span> <span className='float-end'>{domain.tags.join(", ")}</span>
                                        </li>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                        <CopyToClipboard text={getTokenId(domain.label)}
                                            onCopy={() => toast.success("TokenId Copied") }>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard fs-6 float-end cursor-pointer" viewBox="0 0 16 16">
                                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                            </svg>
                                        </CopyToClipboard> 
                                        <span className='fw-bold fs-6 text-muted'>Token ID </span> <span className='float-end me-2'>{obscureAddress(getTokenId(domain.label), 25)}</span>
                                        </li>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                            <span className='fw-bold fs-6 text-muted'>Length </span> <span className='float-end'>{domain.length}</span>
                                        </li>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                            <span className='fw-bold fs-6 text-muted'>Segment Length </span> <span className='float-end'>{domain.segmentLength}</span>
                                        </li>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                            <span className='fw-bold fs-6 text-muted'>Created Date </span> <span className='float-end'>{getDateString(domain.created)}</span>
                                        </li>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                            <span className='fw-bold fs-6 text-muted'>Registered Date </span> <span className='float-end'>{getDateString(domain.registered)}</span>
                                        </li>
                                        <li className='list-group-item border-0 p-0 pb-3'>
                                            <span className='fw-bold fs-6 text-muted'>Expires Date </span> <span className='float-end'>{getDateString(domain.expires)}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container mt-3'> 
                        <div className="row">
                            <DomainEvents id={domain.id} />
                        </div>
                    </div>
                </div>
        </>
    );
    } 
};
 
export default Domain;