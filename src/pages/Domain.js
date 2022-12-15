import React  from "react";
import { Link, useParams } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";  
import {Helmet} from "react-helmet";
import { getDateSimple, getDateString, getLabelHash, getLength, getSegmentLength, getTokenId, isExpired, isExpiring, isPremium, isValidName, obscureAddress, obscureLabel } from "../helpers/String";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify"; 
import DomainEvents from "./partials/DomainEvents"; 
import shareIcon from '../assets/share-white.svg'
import clipboardIcon from "../assets/clipboard.svg";  
import etherScanIcon from "../assets/etherscan.svg"; 
import DomainLabel from "../components/DomainLabel"; 
import OwnerLink from "../components/OwnerLink";
import AlertDomain from "../components/AlertDomain";
import DomainImage from "../components/DomainImage";  

const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;
const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_URL;

const DOMAIN_DETAILS = gql`
    query Domains( $id: String! ) {
        domains ( 
            where: {
                id: $id
            }
        )
        {
            id
            label 
            created
            registered
            expires
            owner {
                id
                primaryName
            }
            registrant {
                id
                primaryName
            }
            length
            extension
            segmentLength
            tags
        }
    }
`;
 
 
const Domain = () => { 
    const { label, extension } = useParams();  
    const id = getLabelHash(label);
    const { data, loading, error } = useQuery(DOMAIN_DETAILS, {
        variables: { id },
    });  

    const encodeHtml = (text) => {
        return text.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
    }
     
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
                <Helmet> 
                    <title>{label}.{extension} - EnsOcean</title>
                    <meta name="description" content={label +"."+ extension +" is available right now. Claim Now."} />
                </Helmet>  
                <div className="container-fluid bg-primary mb-4">
                    <div className="container p-3 text-white">
                        <div className='d-flex justify-content-between align-items-center'> 
                            <div className='d-flex justify-content-start align-items-center gap-3 text-truncate'>
                                <h1 className='m-auto fs-1 fw-bold text-truncate pe-3'>
                                   <DomainLabel label={label} />
                                </h1>
                            </div> 
                            <div className='d-flex align-items-center gap-3'> 
                                <CopyToClipboard text={window.location.href}
                                    onCopy={() => toast.success("Link Copied") }>
                                    <span className='cursor-pointer'>
                                        <img src={shareIcon} width={32} height={32} alt=""  />
                                    </span>
                                </CopyToClipboard> 
                            </div> 
                        </div>
                    </div> 
                </div>
                <div className='container-fluid'> 
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <AlertDomain label={label} />
                            </div>
                        </div>
                        <div className="row"> 
                            <div className="col-lg-4">
                                <div className="card">
                                    <DomainImage label={label} />
                                </div>
                            </div>
                            <div className='col-lg-8 mt-3 mt-lg-0'>
                                <h5 className="card-title fs-4">Details</h5>
                                <hr />
                                <ul className='list-group list-group-flush'>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <span className='fw-bold fs-6 text-muted'>Owner: </span> <span className='float-end'>-</span>
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <CopyToClipboard text={getLabelHash(label)}
                                            onCopy={() => toast.success("TokenId Copied") }>
                                            <span className="cursor-pointer float-end">
                                                <img src={clipboardIcon} alt="" />
                                            </span>
                                        </CopyToClipboard> 
                                        <span className='fw-bold fs-6 text-muted'>Hash </span> <span className='float-end me-2'>{obscureAddress(getLabelHash(label), 25)}</span>
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <span className='fw-bold fs-6 text-muted'>Tags </span> <span className='float-end'>-</span>
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>  
                                        <CopyToClipboard text={getTokenId(label)}
                                            onCopy={() => toast.success("TokenId Copied") }>
                                            <span className="cursor-pointer float-end">
                                                <img src={clipboardIcon} alt="" />
                                            </span>
                                        </CopyToClipboard> 
                                        <span className='fw-bold fs-6 text-muted'>Token ID </span> <span className='float-end me-2'>{obscureLabel(getTokenId(label), 25)}</span>
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
            </>
        )
    } else {
        const domain = data.domains[0];  
        return (
        <> 
            <Helmet> 
              <title>{domain.label || label}.{domain.extension} - EnsOcean</title>
              {!isExpiring(domain.expires) && !isExpired(domain.expires) && !isPremium(domain.expires) &&
                <meta name="description" content={(domain.label || label) +"."+ (domain.extension) +" was registered "+ getDateSimple(domain.registered) +". The web3 name length is "+ domain.length +" and tagged with "+ domain.tags.join(", ")} />
              }
              {isExpiring(domain.expires) &&
                <meta name="description" content={(domain.label || label) +"."+ (domain.extension) +" was registered "+ getDateSimple(domain.registered) +" but is about to expire. Add to your favorites to claim it in the future. "} />
              }
              {isExpired(domain.expires) &&
                <meta name="description" content={(domain.label || label) +"."+ (domain.extension) +" was registered "+ getDateSimple(domain.registered) +" but is available right now. Claim Now."} />
              }
              {isPremium(domain.expires) &&
                <meta name="description" content={(domain.label || label) +"."+ (domain.extension) +" was registered "+ getDateSimple(domain.registered) +" but is premium right now. Claim Now."} />
              }
            </Helmet> 
            <div className="container-fluid bg-primary text-white p-3 mb-4">
                <div className="container">
                    <div className='d-flex flex-column flex-lg-row justify-content-start align-items-lg-center gap-3'> 
                        <div className='d-flex align-items-start text-truncate'>
                            <h1 className='fs-1 fw-bold text-truncate pe-3'>
                                <DomainLabel domain={domain} /> 
                            </h1>
                        </div> 
                        <div className='d-flex flex-row gap-3'> 
                            <a target="_blank" rel="noreferrer" href={ ETHERSCAN_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label || label))} title="View on Etherscan" data-bs-toogle="tooltip" data-bs-title="asklfdja" className='text-white'>
                                <img src={etherScanIcon} width={32} height={32}  alt= "" />
                            </a>
                            <CopyToClipboard text={window.location.href}
                                onCopy={ () => toast.success("Link Copied") }>
                                <span className='cursor-pointer' >
                                    <img src={shareIcon} width={32} alt= "" className="text-white" />
                                </span>
                            </CopyToClipboard> 
                        </div>  
                    </div>
                </div>
            </div>
            <div className='container-fluid'>
                <div className='container'>
                    <div className="row">
                        <div className="col-lg-12">
                            <AlertDomain domain={domain} />
                        </div>
                    </div>
                    <div className="row"> 
                        <div className="col-lg-4">   
                            <div className="card">
                                <DomainImage domain={domain} />
                            </div>
                        </div>
                        <div className='col-lg-8 mt-3 mt-lg-0'>
                            <div className="card-body m-0 m-lg-1 m-md-1 m-sm-0"> 
                                <h5 className="card-title fs-4">Details</h5>
                                <hr />
                                <ul className='list-group list-group-flush'>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <span className='fw-bold fs-6 text-muted'>Owner: </span> <span className='float-end'>
                                            <OwnerLink owner={domain.owner} />
                                        </span>
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <CopyToClipboard text={domain.id}
                                            onCopy={() => toast.success("TokenId Copied") }>
                                            <span className="cursor-pointer float-end">
                                                <img src={clipboardIcon} alt="" />
                                            </span>
                                        </CopyToClipboard> 
                                        <span className='fw-bold fs-6 text-muted'>Hash </span> <span className='float-end me-2'>{obscureAddress(domain.id, 25)}</span>
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <span className='fw-bold fs-6 text-muted'>Tags </span> {domain.tags && <span className='float-end'>{domain.tags.join(", ")}</span>}
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <CopyToClipboard text={getTokenId(domain.label || label)}
                                            onCopy={() => toast.success("TokenId Copied") }>
                                            <span className="cursor-pointer float-end">
                                                <img src={clipboardIcon} alt="" />
                                            </span>
                                        </CopyToClipboard> 
                                        <span className='fw-bold fs-6 text-muted'>Token ID </span> <span className='float-end me-2'>{obscureAddress(getTokenId(domain.label || label), 25)}</span>
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <span className='fw-bold fs-6 text-muted'>Length </span> {domain.label && <span className='float-end'>{domain.length}</span>}
                                    </li>
                                    <li className='list-group-item border-0 p-0 pb-3'>
                                        <span className='fw-bold fs-6 text-muted'>Segment Length </span>  {domain.label &&<span className='float-end'>{domain.segmentLength}</span>}
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