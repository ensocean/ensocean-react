import moment from 'moment';
import { useQuery, gql } from "@apollo/client";
import { useLocation, Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago"; 
import en from 'javascript-time-ago/locale/en'
import { obscureAddress, obscureLabel } from '../../helpers/String';
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo();

const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);
 

const GET_DOMAINS = gql`
    
    query Domains( $skip: Int!, $first: Int!, $orderBy: String!, $orderDirection: String! ) {
        domains ( 
            orderBy: $orderBy
            orderDirection: $orderDirection
            skip: $skip
            first: $first 
            where: {
                label_not: null
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

const FilterResults = ({tab}) => {
    const query = new URLSearchParams(useLocation().search);
    const skip = Number(query.get("skip") || "0");
    const first = Number(query.get("first") || "50");
    const orderBy = query.get("orderBy") || "expires";
    const orderDirection = query.get("orderDirection") || "desc";
    const filter = query.get("filter") || "desc";

    console.log(orderDirection);
    let filters = {
        label_not: null
    };

    const { data, loading, error, refetch } = useQuery(GET_DOMAINS, {
        variables: { skip, first, orderBy, orderDirection, filters }
    });
      
    if(loading) {
        return ( 
            <>
            <div className='table-responsive p-lg-3 placeholder-glow'>
                <table className='table table-hover m-0'>
                    <thead className="table-light fw-bold fs-6">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Owner</th>
                            <th className="p-3">Expires</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody> 
                         {[...Array(10)].map((x, i) =>
                        <tr key={i}>
                            <td className="p-3"><span className="placeholder col-12"></span></td> 
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                        </tr>
                         )}
                    </tbody>
                </table>
            </div>  
            </>     
        )
    } else if (error) {
        return (
            <>
            <div className="table-responsive p-lg-3">
                <table className='table table-hover m-0'>
                    <thead className="table-light fw-bold fs-6">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Owner</th>
                            <th className="p-3">Expires</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='span-3'>
                            <td className='p-3'><span className='text-danger'>{error.message}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div> 
            </>
        );
    } else {
        return (
            <>
            <div className="table-responsive p-lg-3">
                <table className='table table-hover m-0'>
                    <thead className="table-light fw-bold fs-6">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Owner</th>
                            <th className="p-3">Expires</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.domains.length < 1 &&
                            <tr className='span-3'>
                                <td className='p-3'><span className='text-warning'>No Result</span></td>
                            </tr>
                        } 
                        {data.domains.map((domain) => (
                        <tr key={domain.id}>
                            <td className="p-3">
                                <Link
                                className="text-decoration-none" 
                                data-bs-toggle="tooltip" 
                                data-bs-title={"View "+ domain.name +" on EnsOcean"}
                                title={"View "+ domain.name +" on EnsOcean"}
                                to={domain.name}>{obscureLabel(domain.name, 20)}</Link> 
                            </td> 
                            <td className="p-3">{obscureAddress(domain.owner || "", 20)} </td>
                            <td className="p-3">{timeAgo.format(moment.unix(domain.expires).toDate())} </td>
                            <td className="p-3">{timeAgo.format(moment.unix(domain.created).toDate())} </td>
                            <td className="p-3">{timeAgo.format(moment.unix(domain.registered).toDate())}</td>
                            <td className="p-3"> </td>
                        </tr>
                        ))}  
                    </tbody>
                </table>
            </div> 
            </>
        )
    }  
}

export default FilterResults;