import React  from "react";
import { useParams } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";
import DomainAvailable from "../components/DomainAvailable";
import DomainLoading from "../components/DomainLoading";
import DomainDetails from "../components/DomainDetails";
import {Helmet} from "react-helmet";

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
            <Helmet> 
              <title>{domain.name} - EnsOcean</title>
              <meta name="description" content="{domain.name}" />
            </Helmet> 
            <DomainDetails domain={domain} />
        </>
    );
    } 
};
 
export default Domain;