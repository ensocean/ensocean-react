import React, { Component } from "react";
import { Link, useParams } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";
import {  getTokenId, obscureAddress, obscureString } from '../helpers/String'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import moment from 'moment'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import spinner from '../assets/spinner2.svg'
import DomainEvents from './partials/DomainEvents'; 
import EnsControllerAbi from '../abis/EthRegistrarController.json'
import { ethers } from 'ethers'
import DomainAvailable from "../components/DomainAvailable";
import DomainLoading from "../components/DomainLoading";
import DomainDetails from "../components/DomainDetails";

const ETHEREUM_RPC_URL = process.env.REACT_APP_ETHEREUM_RPC_URL;
const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS;
const ENS_CONTROLLER_ADDRESS = process.env.REACT_APP_ENS_CONTROLLER_ADDRESS;
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
            segmentLength
            tags
        }
    }
`;
 
const Domain = () => {
    let available;

    const { label } = useParams();  
    const { data, loading, error } = useQuery(DOMAIN_DETAILS, {
        variables: { label },
    });  
 
    if(loading) {
        return (
            <>
                <DomainLoading label={label} />
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
                <DomainAvailable label={label} />
            </>
        )
    } else {
        const domain = data.domains[0]; 
        return (
        <> 
            <DomainDetails domain={domain} />
        </>
    );
    } 
};
 
export default Domain;