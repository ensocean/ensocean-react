import {Helmet} from "react-helmet-async";
import { useRegisterlist } from "react-use-registerlist";
import { Trash, ArrowClockwise, Info } from "react-bootstrap-icons";
import DomainLink from "../components/DomainLink";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import bulkControllerAbi from "../abis/BulkEthRegistrarController.json";
import { getDurationSeconds, getTimeAgo, ZERO_ADDRESS } from "../helpers/String";
import { Button, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import {DelayInput} from 'react-delay-input';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Numeral from "react-numeral"; 
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const ENS_CONTROLLER_ADDRESS = process.env.REACT_APP_ENS_CONTROLLER_ADDRESS;
const BULK_CONTROLLER_ADDRESS = process.env.REACT_APP_BULK_CONTROLLER_ADDRESS; 
const DEFAULT_RESOLVER = process.env.REACT_APP_DEFAULT_RESOLVER;
const MIN_REGISTRATION_DURATION = process.env.REACT_APP_MIN_REGISTRATION_DURATION;
const ETHERSCAN_ADDR = process.env.REACT_APP_ETHERSCAN_ADDR;

const secret = uuidv4().replace("-", "").toString();

const Register = () => {  
  const { isEmpty, totalUniqueItems, getItem, items, updateItem, removeItem, emptyRegisterlist } = useRegisterlist();
  const [validationError, setValidationError] = useState(null);
  const [hasError, setHasError] = useState(null);
  const {isConnected, address } = useAccount();
  
  const query = items.map(t=> { 
    return {
      name: t.label,
      duration: getDurationSeconds(t.duration || 1, t.durationPeriod || "year"),
      owner: address,
      resolver: DEFAULT_RESOLVER,
      addr: ZERO_ADDRESS
    }
  });
  
  const { data, isError, refetch, isFetching, error } = useContractRead({
    address: BULK_CONTROLLER_ADDRESS,
    abi: bulkControllerAbi,
    functionName: "bulkRentPrice",
    args: [ENS_CONTROLLER_ADDRESS, query]
  });  
 
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
 
  const { config } = usePrepareContractWrite({
    address: BULK_CONTROLLER_ADDRESS,
    abi: bulkControllerAbi, 
    functionName: "bulkCommit",
    args: [ENS_CONTROLLER_ADDRESS, query, secret]
  });

  const { data: commitData, error: commitError, write: commit, isLoading: isCommitLoading } = useContractWrite(config);

  const { isLoading: isCommitTxLoading, isSuccess: isCommitTxSuccess, error: commitTxError } = useWaitForTransaction({
    hash: commitData?.hash,
  });
 
  const handleCommit = (e)=> { 
    commit();
  }

  const [isTimerCompleted, setIsTimerCompleted] = useState(false);
   
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
      <div className="container pt-4">
        <div className="d-flex flex-row justify-content-between mt-3 mb-3"> 
          <div className="flex-shrink-0">
            <span className="badge rounded-pill text-muted">Total {totalUniqueItems} name(s) </span>
          </div> 
          <div className="gap-3 d-flex justify-content-between ">
            {totalUniqueItems > 0 && 
              <button className="btn btn-light ps-1" onClick={(e)=> refetch()}>
                {!isFetching && <span><ArrowClockwise /> Refresh</span> } 
                {isFetching && <span><Spinner animation="border" variant="white" size="sm" /> Refreshing </span>}  
              </button>
            }
            {totalUniqueItems > 0 && 
              <button className="btn btn-light ps-1" onClick={(e)=> emptyRegisterlist()}>
                <Trash /> Clear Cart
              </button>
            }
          </div>  
        </div> 
        <div className="container"> 
          {commitError && <div className="alert alert-danger">{commitError.message}</div>}
          {hasError && <div className="alert alert-danger">{validationError}</div>}
          <div className="d-none d-lg-block">
            <div className="row border-bottom border-light bg-light pt-2 pb-2">
              <div className="col-8 col-lg-5 p-2">
                <strong>Name</strong>
              </div>
              <div className="col-4 col-lg-3 p-2">
                <strong>Duration</strong>
              </div>
              <div className="col-12 col-lg-4 p-2">
                <strong>Price</strong>
              </div>
            </div>
          </div>
          {isEmpty && 
            <div className="flex-fill">
              Your bulk registration cart is empty.
            </div>
          }
          {items.map((item, i) => (  
            <div className="row border-bottom border-light" key={i}>
              <div className="col-12 col-lg-5 text-truncate p-2">
                <DomainLink domain={item} showAvability={false} />
              </div>
              <div className="col-6 col-lg-3 p-2">
                <div className="input-group form-group"> 
                    <DelayInput 
                      type="number" 
                      key={item.id} 
                      minLength={1} 
                      delayTimeout={500} 
                      disabled={isFetching ? "disabled": ""} 
                      min={1}  
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
              </div>
              <div className="col-6 col-lg-4 p-2 d-flex flex-row justify-content-between align-items-center">
                {isError && <span className="text-danger">{error.message}</span>}
                {isFetching && <Spinner animation="border" variant="dark" size="sm" /> }
                {!isError && !isFetching && <span><Numeral value={ ethers.utils.formatUnits(data.result[i].price)} format="0.00000" /> ETH</span>} 
                <button className="btn btn-light btn-sm" onClick={(e)=> {  e.preventDefault(); removeItem(item.id) }}>
                  <Trash />
                </button>
              </div> 
            </div> 
          ))}  
        </div>
        <div className="row mt-3">
          <div className="col-12">
            {totalUniqueItems > 0 && 
            <div className="d-flex flex-row justify-content-end">
              {isError && <span className="text-danger">{error.message}</span>}
              {isFetching && <Spinner animation="border" variant="dark" size="sm" /> }
              {!isError && !isFetching && <span> <strong>Total (Inc. Fee): </strong> <Numeral value={ethers.utils.formatUnits(data?.totalPriceWithFee)} format="0.00000" /> ETH </span>} 
            </div>
            }
            <div className="d-flex flex-row justify-content-end align-items-center gap-3 mt-3">
                  {!isTimerCompleted && isCommitTxSuccess &&
                    <>
                      <CountdownCircleTimer
                        size={48}
                        strokeWidth={3}
                        isPlaying
                        duration={60} 
                        colors={['#239e01', '#2ece02', '#e5ed07', '#bf0505']}
                        colorsTime={[7, 5, 2, 0]}
                        onComplete={(e)=> setIsTimerCompleted(true)}
                      >
                        {({ remainingTime }) => remainingTime}
                      </CountdownCircleTimer> 

                      Wait for 1 Minute 
                      <OverlayTrigger trigger="click" rootClose placement="top" overlay={
                        <Popover id="popover-basic">
                          <Popover.Header as="h3">Why am i waiting?</Popover.Header>
                          <Popover.Body>
                            The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request.
                          </Popover.Body>
                        </Popover>
                      }>
                        <Button variant="light" size="sm"> <Info /> </Button>
                      </OverlayTrigger>
                    </>
                  }

                  {totalUniqueItems > 0 && isConnected && !isCommitTxSuccess &&
                  <button className="btn btn-primary btn-lg" disabled={!commit || isCommitLoading || isCommitTxLoading || isCommitTxSuccess || hasError} onClick={handleCommit}>
                      {isCommitLoading && <Spinner animation="border" variant="white" size="sm" /> }
                      {isCommitTxLoading && <> <Spinner animation="border" variant="white" size="sm" /> Tx Waiting </> }
                      { !isCommitTxSuccess && !isCommitTxLoading && <> Request to Claim </>}
                      { isCommitTxSuccess && <>Wait for 1 Minute</>}
                  </button>
                  }
                   
                  {data && isCommitTxSuccess && isTimerCompleted &&
                    <ClaimButton isTimerCompleted={isTimerCompleted} query={query} secret={secret} totalPriceWithFee={ethers.utils.formatUnits(data?.totalPriceWithFee)} />
                  }
            </div>
          </div>
        </div> 
      </div> 
    </>
  );
};

function ClaimButton({query, secret, totalPriceWithFee}) {
  const { emptyRegisterlist } = useRegisterlist();
  const { isConnected, address } = useAccount();
  
  const { config: registerConfig } = usePrepareContractWrite({
    address: BULK_CONTROLLER_ADDRESS,
    abi: bulkControllerAbi, 
    functionName: "bulkRegister",
    args: [ENS_CONTROLLER_ADDRESS, query, secret, {
      value: ethers.utils.parseEther(totalPriceWithFee)
    }]
  })

  const { data: registerData, error: registerError, write: register, isLoading: isRegisterLoading } = useContractWrite(registerConfig);

  const { isLoading: isRegisterTxLoading, isSuccess: isRegisterTxSuccess, error: registerTxError, isError: isRegisterTxError } = useWaitForTransaction({
    hash: registerData?.hash,
  });

  const handleRegister = (e)=> {  
    register();
  }

  useEffect(()=> {
      if(isRegisterTxSuccess) {
        emptyRegisterlist();
      }
  }, [isRegisterTxSuccess])

  return (
    <>
    {isConnected && !isRegisterTxSuccess &&
      <button className="btn btn-success btn-lg" disabled={!register || isRegisterLoading || isRegisterTxLoading} onClick={handleRegister}>
          {isRegisterLoading && <Spinner animation="border" variant="white" size="sm" /> }
          {isRegisterTxLoading && <> <Spinner animation="border" variant="white" size="sm" /> Tx Waiting </> }
          {!isRegisterTxSuccess && !isRegisterTxLoading && <> Claim </>}
          {isRegisterTxSuccess && <>Completed</>}
      </button>
    }

    {isRegisterTxSuccess && 
      <div className="flex-fill d-flex flex-row justify-content-center align-items-center alert alert-success gap-2">
        <strong>Success!</strong> Transaction Completed
        <a target="_blank" rel="noreferrer" href={ ETHERSCAN_ADDR +"/tx/"+ registerData?.hash } >
          View on Etherscan
        </a>
      </div>
    }

    {registerError && 
      <div className="flex-fill d-flex flex-row justify-content-center align-items-center alert alert-danger gap-2">
        <strong>Error!</strong> {registerError.message}
      </div>
    }

    {registerTxError && 
      <div className="flex-fill d-flex flex-row justify-content-center align-items-center alert alert-danger gap-2">
        <strong>Error!</strong> {registerTxError.message}
      </div>
    }
    </>
  )
}
   

export default Register; 