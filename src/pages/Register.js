import {Helmet} from "react-helmet";
import { useCart } from "react-use-cart";
import { Trash, X, ArrowClockwise } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import DomainLink from "../components/DomainLink";
import { useAccount, useNetwork, useContractRead } from 'wagmi';
import bulkControllerAbi from "../abis/BulkEthRegistrarController.json";
import { getDurationSeconds, ZERO_ADDRESS } from "../helpers/String";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {DelayInput} from 'react-delay-input';

const ENS_CONTROLLER_ADDRESS = process.env.REACT_APP_ENS_CONTROLLER_ADDRESS;
const BULK_CONTROLLER_ADDRESS = process.env.REACT_APP_BULK_CONTROLLER_ADDRESS;
const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);
const DEFAULT_RESOLVER = process.env.REACT_APP_DEFAULT_RESOLVER;
const MIN_REGISTRATION_DURATION = process.env.REACT_APP_MIN_REGISTRATION_DURATION;

  
const Register = () => {
  const { isConnected, address } = useAccount();   
  const { chain } = useNetwork();
  const { isEmpty, totalUniqueItems, getItem, items, updateItem, removeItem, emptyCart } = useCart();
  const [validationError, setValidationError] = useState(null);
  const [hasError, setHasError] = useState(null);

  const query = items.map(t=> { 
    return {
      name: t.label,
      duration: getDurationSeconds(t.duration || 1, t.durationPeriod || "year"),
      owner: ZERO_ADDRESS,
      resolver: DEFAULT_RESOLVER,
      addr: ZERO_ADDRESS
    }
  });
  
  const { data, isLoading, isError, refetch, isFetching, isRefetching, isSuccess, error, isFetched } = useContractRead({
    addressOrName: BULK_CONTROLLER_ADDRESS,
    contractInterface: bulkControllerAbi,
    functionName: "bulkRentPrice",
    args: [ENS_CONTROLLER_ADDRESS, query]
  });  


  const isSupportedNetwork = () => {
    return isConnected && SUPPORTED_CHAIN_ID !== chain?.id;
  }

  const handleDurationChange = (e, item) => {   
    const value = e.target.value; 
    const newItem = getItem(item.id);
    const durationInSeconds = getDurationSeconds(Number(value), newItem.durationPeriod || "year");
    if(durationInSeconds < Number(MIN_REGISTRATION_DURATION)) {
      setValidationError("Min. Registration Duration should be 28 days.");
      setHasError(true);
    } else {
      setValidationError(null);
      setHasError(false);
    }
    newItem.duration = value; 
    updateItem(item.id, newItem);
  }

  const handlePeriodChange = (e, item) => {
    const value = e.target.value; 
    const newItem = getItem(item.id);
    const durationInSeconds = getDurationSeconds(item.duration || 1, value);
    
    if(durationInSeconds < Number(MIN_REGISTRATION_DURATION)) {
      setValidationError("Min. Registration Duration should be 28 days.");
      setHasError(true);
    } else {
      setValidationError(null);
      setHasError(false); 
    } 

    newItem.durationPeriod = value; 
    updateItem(item.id, newItem); 
  }
 
  return (
    <>  
      <Helmet> 
            <title>Register Ethereum Name Service (ENS) - EnsOcean</title>
            <meta name="description" content="Register your web3 name easily with our bulk tool" />
      </Helmet>
      <div className="container-fluid bg-primary">
          <div className="container text-center p-3 text-white">
              <h1>Claim Your Web3 Names</h1>
          </div> 
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12"> 
              <div className="d-flex flex-row justify-content-between mt-3">
                <div className="flex-shrink-0">
                  <h3 className="badge rounded-pill text-bg-primary">Total {totalUniqueItems} name(s) </h3>
                </div>
                <div className="gap-3 d-flex">
                  {totalUniqueItems > 0 && 
                    <button className="btn btn-primary ps-1" onClick={(e)=> refetch()}>
                      {!isFetching && <span><ArrowClockwise /> Refresh</span> } 
                      {isFetching && <span><Spinner animation="border" variant="white" size="sm" /> Refreshing </span>}  
                    </button>
                  }
                  {totalUniqueItems > 0 && 
                    <button className="btn btn-danger ps-1" onClick={(e)=> emptyCart()}>
                      <Trash /> Clear Cart
                    </button>
                  }
                </div>
              </div>
              <div className="table-responsive mt-3">
                {hasError && <div className="alert alert-danger">{validationError}</div>}
                <table className="table">
                  <thead className="fw-bold fs-4">
                    <tr>
                      <td scope="col">Name</td>
                      <td scope="col">Duration</td>
                      <td scope="col">Price</td>
                      <td scope="col"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {isEmpty && 
                      <tr key={1}>
                        <td colSpan={3}>
                          <span>Your cart is empty. &nbsp;
                            <Link className=" link-primary" to="/find">Click to search web3 name.</Link>
                          </span>
                        </td>
                      </tr>
                    }
                    {items.map((item, i) => (
                      <tr key={item.id}> 
                          <td className=" pt-3 pb-3">
                            <DomainLink domain={item} showAvability={false} />
                          </td>
                          <td>
                            <div className="input-group form-group">

                              <DelayInput 
                                type="number" 
                                key={item.id} 
                                minLength={1} 
                                delayTimeout={500} 
                                disabled={isFetching ? "disabled": ""} 
                                min={1} 
                                defaultValue={1}
                                value={item.duration || 1} 
                                className="form-control" 
                                onChange={(e)=> handleDurationChange(e, item)} />

                              <select className="form-select" disabled={isFetching ? "disabled": ""}
                                  defaultValue={item.durationPeriod || "year"} 
                                  defaultChecked={item.durationPeriod || "year"} 
                                  onChange={(e)=> handlePeriodChange(e, item)}>
                                <option key="year" value="year">Year</option>
                                <option key="month" value="month">Month</option>
                                <option key="week" value="week">Week</option>
                                <option key="day" value="day">Day</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            {isError && <span className="text-danger">{error.message}</span>}
                            {isFetching && <Spinner animation="border" variant="dark" size="sm" /> }
                            {!isError && !isFetching && <span>{ ethers.utils.formatUnits(data.result[i].price)} ETH </span>}
                          </td>
                          <td>
                            <button className="btn btn-outline-danger btn-sm ms-2 float-end" onClick={(e)=> {  e.preventDefault(); removeItem(item.id) }}>
                              <Trash />
                            </button>
                          </td> 
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex flex-column justify-content-end gap-3">
                <div className="d-flex flex-row justify-content-end">
                {isError && <span className="text-danger">{error.message}</span>}
                {isFetching && <Spinner animation="border" variant="dark" size="sm" /> }
                {!isError && !isFetching && <span> <strong>Total (Inc. Fee): </strong> {ethers.utils.formatUnits(data.totalPriceWithFee)} ETH </span>} 
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <button className="btn btn-success btn-lg" disabled={hasError?"disabled": ""}>
                    Request to Claim All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> 
    </>
  );
};
  
export default Register; 