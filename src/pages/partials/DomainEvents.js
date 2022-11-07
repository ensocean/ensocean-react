 
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { obscureAddress } from "../../helpers/String";
import moment from 'moment';
import TimeAgo from "javascript-time-ago"; 
const timeAgo = new TimeAgo();

const ETHERSCAN_ADDR = process.env.REACT_APP_ETHERSCAN_ADDR;

const DOMAIN_EVENTS = gql`
    query DomainsEvents( $id: String! ) {
        domainEvents(
            orderBy: blockNumber 
            orderDirection: desc 
            where: {
              domain: $id
            }
        ) 
        {
            id
            name
            from
            to
            cost
            expires
            blockTimestamp
            transactionID 
        }  
    }
`;

const DomainEvents = ({ id }) => {
    
    const { data, loading, error } = useQuery(DOMAIN_EVENTS, {
        variables: { id },
    });

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>
 
    return (
        <>
            <div class="accordion" id="events">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button bg-light fw-bold fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#logs" aria-expanded="true">
                            Activity
                        </button>
                    </h2>
                    <div id="logs" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#events">
                        <div class="accordion-body p-0 ">
                            <div className="tab-responsive">
                                <table className='table table-hover m-0'>
                                    <thead class="table-light fw-bold fs-6">
                                        <tr>
                                            <th className="p-3">Event</th>
                                            <th className="p-3">Cost</th>
                                            <th className="p-3">From</th>
                                            <th className="p-3">To</th>
                                            <th className="p-3">Tx</th>
                                            <th className="p-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {data.domainEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td className="p-3">{event.name}</td>
                                            <td className="p-3">{event.cost}</td>
                                            <td className="p-3"><Link to={"/account/"+ event.from}>{obscureAddress(event.from)}</Link></td>
                                            <td className="p-3"><Link to={"/account/"+ event.to}>{obscureAddress(event.to)}</Link></td>
                                            <td className="p-3"><a target="_blank" href={ETHERSCAN_ADDR + "/tx/"+ event.transactionID} bs-data-toogle="tooltip" title="View on etherscan" bs-data-title="View on etherscan">{obscureAddress(event.transactionID)}</a></td>
                                            <td className="p-3">{timeAgo.format(moment.unix(event.blockTimestamp).toDate())}</td>
                                        </tr>
                                    ))} 
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DomainEvents;