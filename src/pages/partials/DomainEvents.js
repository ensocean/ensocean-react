 
import { useQuery, gql } from "@apollo/client"; 
import OwnerLink from "../../components/OwnerLink";
import { getTimeAgo, obscureAddress } from "../../helpers/String";

const ETHERSCAN_ADDR = process.env.REACT_APP_ETHERSCAN_ADDR;

const DOMAIN_EVENTS = gql`
    query DomainsEvents( $id: String! ) {
        domainEvents(
            first: 50
            orderBy: blockNumber 
            orderDirection: desc 
            where: {
              domain: $id 
            }
        ) 
        {
            id
            name
            from {
                id
                primaryName
            }
            to {
                id
                primaryName
            }
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
        <div className="col-12">
            <div className="accordion" id="events">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button bg-light fw-bold fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#logs" aria-expanded="true">
                            Activity
                        </button>
                    </h2>
                    <div id="logs" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#events">
                        <div className="accordion-body p-0 ">
                            <div className="table-responsive">
                                <table className='table table-hover m-0'>
                                    <thead className="table-light fw-bold fs-6">
                                        <tr>
                                            <th className="p-3">Event</th> 
                                            <th className="p-3">From</th>
                                            <th className="p-3">To</th>
                                            <th className="p-3">Tx</th>
                                            <th className="p-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {data.domainEvents.length < 1 && 
                                        <tr key="">
                                            <td colSpan={5}>No events found</td>
                                        </tr>
                                    }
                                    {data.domainEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td className="p-3">{event.name }</td>
                                            <td className="p-3">{event.from != null && 
                                                <OwnerLink owner={event.from} />}
                                            </td>
                                            <td className="p-3">{event.to != null && 
                                                <OwnerLink owner={event.to} />
                                            }
                                            </td>
                                            <td className="p-3">
                                                <button className="btn btn-outline-warning">
                                                    <a className="text-dark" target="_blank" rel="noreferrer" href={ETHERSCAN_ADDR + "/tx/"+ event.transactionID} bs-data-toogle="tooltip" title="View on etherscan" bs-data-title="View on etherscan">{obscureAddress(event.transactionID)}</a>
                                                </button>
                                            </td>
                                            <td className="p-3">{getTimeAgo(event.blockTimestamp)}</td>
                                        </tr>
                                    ))} 
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default DomainEvents;