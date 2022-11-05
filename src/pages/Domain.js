import { useParams, useLocation } from 'react-router-dom';


const Domain = () => {
    const { domain } = useParams();  
    console.log(domain) 
    return <h1>Domain</h1>;
};

export default Domain;