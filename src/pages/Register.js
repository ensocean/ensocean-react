import {Helmet} from "react-helmet-async";
import { useRegisterlist } from "react-use-registerlist";
import { Trash, ArrowClockwise, Info, ExclamationCircleFill } from "react-bootstrap-icons";
import DomainLink from "../components/DomainLink";
import { useAccount, useBalance, useContractRead, useContractWrite, useFeeData, useNetwork, usePrepareContractWrite, useProvider, useSigner, useSwitchNetwork, useWaitForTransaction } from 'wagmi';
import bulkControllerAbi from "../abis/BulkEthRegistrarController.json";
import { getDurationSeconds, getTimeAgo, ZERO_ADDRESS } from "../helpers/String";
import { Button, Form, Overlay, OverlayTrigger, Popover, Spinner, Tooltip } from "react-bootstrap";
import {DelayInput} from 'react-delay-input';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Numeral from "react-numeral"; 
import { v4 as uuidv4 } from 'uuid';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import useEthPrice from "../context/EthPriceContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const ENS_CONTROLLER_ADDRESS = process.env.REACT_APP_ENS_CONTROLLER_ADDRESS;
const BULK_CONTROLLER_ADDRESS = process.env.REACT_APP_BULK_CONTROLLER_ADDRESS; 
const DEFAULT_RESOLVER = process.env.REACT_APP_DEFAULT_RESOLVER;
const MIN_REGISTRATION_DURATION = process.env.REACT_APP_MIN_REGISTRATION_DURATION;
const ETHERSCAN_ADDR = process.env.REACT_APP_ETHERSCAN_ADDR;
const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const _secret = uuidv4().toString().replace(/-/gi, '');

const Register = () => {  
  const secret = _secret;
   
  const [ priceInUsd, setPriceInUsd ] = useState(false);
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);
  const [ hasError, setHasError ] = useState(false);
  const [ validationError, setValidationError ] = useState(null);
  const [ estimateGasLoading, setEstimatedGasLoading ] = useState(true);
  const [ estimatedGas, setEstimatedGas ] = useState(0);
  
  const provider = useProvider()
  const { openConnectModal } = useConnectModal(); 
  const { data: signer } = useSigner();
  const { data: feeData, isError: isFeeDataError, isLoading: isFeeDataLoading } = useFeeData();

  const { isEmpty, totalUniqueItems, getItem, items, updateItem, removeItem, emptyRegisterlist } = useRegisterlist();
  const { chain } = useNetwork();
  const { error: swtichNetworkError, isLoading: isChainLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
 
  const { isConnected, address } = useAccount();
  const { price: ethPrice, isLoading: isPriceLoading, error: priceError, refetch: ethPriceRefetch } = useEthPrice();

  const { data: balance, isError: isBalanceError, isLoading: isBalanceLoading, isFetched: isBalanceFetched, } = useBalance({ watch: true, address: address })

  const handlePriceInUsdChange = (e) => {
    setPriceInUsd(!priceInUsd);
  }
 
  const query = items.map(t=> { 
    return {
      name: t.label,
      duration: getDurationSeconds(t.duration || 1, t.durationPeriod || "year"),
      owner: address || ZERO_ADDRESS,
      resolver: DEFAULT_RESOLVER,
      addr: ZERO_ADDRESS
    }
  });
  
  const { data, isError, refetch, isFetching, isFetched, error } = useContractRead({
    watch: true,
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
 
  const { config: commitConfig } = usePrepareContractWrite({
    address: BULK_CONTROLLER_ADDRESS,
    abi: bulkControllerAbi, 
    chainId: SUPPORTED_CHAIN_ID,
    functionName: "bulkCommit",
    args: [ENS_CONTROLLER_ADDRESS, query, secret]
  });

  const { data: commitData, error: commitError, write: commit, isLoading: isCommitLoading,  } = useContractWrite(commitConfig);

  const { isLoading: isCommitTxLoading, isSuccess: isCommitTxSuccess, error: commitTxError } = useWaitForTransaction({
    hash: commitData?.hash,
    onError(err) {
      localStorage.setItem("secret", secret);
      toast.error(`Commit transaction has been failed.`,
      { 
        autoClose: 5000
      })
    },
    onSuccess(data) {
      localStorage.removeItem("secret");
      toast.success(`Commit transaction has been completed. Please wait for 1 minute.`,
      { 
        autoClose: 5000
      });
    }, 
  });
     
  const { config: registerConfig, refetch: registerRefetch } = usePrepareContractWrite({
    address: BULK_CONTROLLER_ADDRESS,
    abi: bulkControllerAbi, 
    chainId: SUPPORTED_CHAIN_ID,
    functionName: "bulkRegister",
    args: [ENS_CONTROLLER_ADDRESS, query, secret, {
      value: data?.totalPriceWithFee
    }]
  })
    
  const { data: registerData, error: registerError, write: register, isLoading: isRegisterLoading, reset: registerReset } = useContractWrite(registerConfig);
  
  const { isLoading: isRegisterTxLoading, isSuccess: isRegisterTxSuccess, error: registerTxError, isError: isRegisterTxError } = useWaitForTransaction({
    hash: registerData?.hash,
    onError(err) {
      localStorage.removeItem("secret");
      toast.error(`Transaction has been failed.`,
      { 
        autoClose: 5000
      })
    },
    onSuccess(data) {
      localStorage.removeItem("secret");
      toast.success(`Transaction has been completed. `,
      { 
        autoClose: 5000
      });
      setHasError(false);
      setValidationError(null);
      emptyRegisterlist();
    }, 
  });

  
  const handleConnect = (e) => {
    e.preventDefault();
    openConnectModal();
  }

  const handleRegister = (e)=> {  
    register();
  }
 
  const handleCommit = (e)=> { 
    commit(); 
  }

  const handleItemRemove = (e, item)=> {
    e.preventDefault(); 
    removeItem(item.id);
    setHasError(false);
    setValidationError(null);
  }
   
  const handleSwitchChain = (e) => {
    e.preventDefault();
    switchNetwork?.(SUPPORTED_CHAIN_ID);
    if(error) { 
        toast.error(error.message)
    }
  }

  const isAvailableBalance = ()=> {
    if(isBalanceLoading) return false;
    if(isBalanceError) return false; 
    if(isFetching) return false;
    if(isError) return false;
    return balance?.value.gte(data?.totalPriceWithFee);
  }

  const handleRefetch = (e) => {
    refetch(); 
    ethPriceRefetch();
    registerReset();
    registerRefetch();
    estimateGas();
  }

  const handleTimerCompleted = (e) => {
    delay(2000); 
    setIsTimerCompleted(true);
    registerRefetch();
    registerReset();
  }
 
  const estimateGas = async () => {
    if(!registerConfig?.request) return;
    if(isFeeDataLoading) return;
    try {
      setEstimatedGasLoading(true);
      const registerGasPrice = await provider.estimateGas(registerConfig?.request);
      setEstimatedGas(registerGasPrice.mul(feeData?.gasPrice).toString());
      setEstimatedGasLoading(false);
    } catch(e) {
      console.error("Gas Estimation Failed: "+ e.message);
    }
  }
  
  useEffect(()=> {
    
    estimateGas();

    data?.result.forEach(item => {
      if(!item.available) {
        setHasError(true);
        setValidationError("One or more items already registered. Please remove them to continue.")
      }
    });

  }, [data, items])

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
        <div className="d-flex flex-column flex-md-row justify-content-between mt-3 mb-3 gap-3"> 
          <div className="flex-fill d-flex flex-row align-items-center justify-content-between gap-3">
            <span className="badge rounded-pill text-muted">Total {totalUniqueItems} name(s) </span>
            <div className="d-flex flex-row align-items-center justify-content-end">
              <Form.Check type="switch" size="lg" label="USD" defaultChecked={priceInUsd} onChange={handlePriceInUsdChange} />
            </div> 
          </div> 
          <div className="d-flex flex-row align-items-center justify-content-between gap-3">
              {totalUniqueItems > 0 && 
                <>
                  <button className="btn btn-outline-primary" onClick={handleRefetch}>
                    {!isFetching && <span><ArrowClockwise /> Refresh</span> } 
                    {isFetching && <span><Spinner animation="border" size="sm" /> Refreshing </span>}  
                  </button> 
                  <button className="btn btn-outline-primary" onClick={(e)=> emptyRegisterlist()}>
                    <Trash /> Clear Cart
                  </button>
                </>
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
                <strong>Price</strong>
              </div>
              <div className="col-12 col-lg-4 p-2">
                <strong>Duration</strong>
              </div>
            </div>
          </div>

          {isEmpty && 
            <div className="row border-bottom d-flex flex-column justify-content-center align-items-center gap-2 pt-3">
              <p className="text-center">
              Your bulk registration cart is empty. Click <Link to="/find"> here </Link> to find your web3 name(s).
              </p>
            </div>
          }

          {items.map((item, i) => (  
            <div className="row border-bottom border-light" key={i}>
              <div className="col-12 col-lg-5 text-truncate p-2 d-flex flex-row justify-content-between align-items-center">
                  <div className="d-flex flex-row align-items-center gap-2 text-truncate">
                    <DomainLink domain={item} showAvability={false} /> 
                    {!isFetching && !data?.result[i].available && 
                        <OverlayTrigger trigger="click" rootClose placement="top" overlay={
                          <Popover>
                            <Popover.Header as="h3">Not available</Popover.Header>
                            <Popover.Body>
                              Not available right now. This item has registered since you added.
                            </Popover.Body>
                          </Popover>
                        }>
                          <ExclamationCircleFill className="text-danger" /> 
                        </OverlayTrigger>
                      }
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <button className="btn btn-light btn-sm d-block d-lg-none" onClick={(e)=> handleItemRemove(e, item)}>
                      <Trash />
                    </button>
                  </div>
              </div>
              <div className="col-6 col-lg-3 p-2 text-end text-md-start d-flex align-items-center">
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
              <div className="col-6 col-lg-4 p-2 d-flex flex-row justify-content-end  justify-content-lg-between align-items-center">
                <Price data={data} isFetching={isFetching} price={data?.result[i].price} ethPrice={ethPrice} quoteSymbol={"USD"} priceInUsd={priceInUsd} />
                <button className="btn btn-light btn-sm d-none d-lg-block" onClick={(e)=> handleItemRemove(e, item)}>
                  <Trash />
                </button>
              </div> 
            </div> 
          ))}  
        </div>

        <div className="row mt-3">
          <div className="col-12">

            {totalUniqueItems > 0 && 
              <div className="d-flex flex-column justify-content-end align-items-end">
                {estimatedGas > 0 &&
                <span>
                 <strong>Estimated Gas: </strong> <Price isFetching={estimateGasLoading} price={estimatedGas} ethPrice={ethPrice} quoteSymbol={"USD"} priceInUsd={priceInUsd} /> 
                </span>
                }
                <span>
                  <strong>Total (Inc. Fee): </strong> &nbsp;
                  <Price isError={isError} isFetching={isFetching} price={data?.totalPriceWithFee} ethPrice={ethPrice} quoteSymbol={"USD"} priceInUsd={priceInUsd} />
                </span>
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
                        onComplete={handleTimerCompleted}
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

                {data && !isCommitTxSuccess && !isTimerCompleted && 
                  <>
                    {isConnected && SUPPORTED_CHAIN_ID !== chain?.id &&
                        <OverlayTrigger placement="top"  overlay={<Tooltip>Wrong Network! Click to Change Network</Tooltip>} >
                            <button className={"btn btn-danger"} disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
                            {isChainLoading && pendingChainId === SUPPORTED_CHAIN_ID && <Spinner animation="border" variant="white" size="sm" />}
                            <span> Wrong Network</span>
                            </button> 
                        </OverlayTrigger>
                    }

                    {totalUniqueItems > 0 && isConnected && !isCommitTxSuccess && SUPPORTED_CHAIN_ID === chain?.id &&
                      <button className="btn btn-primary btn-lg" disabled={!commit || isCommitLoading || isCommitTxLoading || hasError || isFetching || isBalanceLoading || !isAvailableBalance()} onClick={handleCommit}>
                          { (isFetching || isCommitLoading || isCommitTxLoading || isBalanceLoading) && <Spinner animation="border" variant="white" size="sm" /> }
                          { isCommitTxLoading && <> Waiting for transaction... </> }
                          { !isCommitTxSuccess && !isCommitTxLoading && isAvailableBalance() && <> Request to Register </>}
                          { isCommitTxSuccess && <>Wait for 1 Minute</>}
                          { !isFetching && !isAvailableBalance() && <> Unsufficient Balance</>}
                      </button> 
                    }

                  {totalUniqueItems > 0 && !isConnected &&
                      <button className="btn btn-primary btn-lg" onClick={handleConnect}>
                         <span>Connect Wallet</span>
                      </button> 
                    }
                  </>
                }
                   
                {data && isCommitTxSuccess && isTimerCompleted && 
                  <>
                    {isConnected && SUPPORTED_CHAIN_ID !== chain?.id &&
                        <OverlayTrigger placement="top"  overlay={<Tooltip>Wrong Network! Click to Change Network</Tooltip>} >
                            <button className={"btn btn-danger"} disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
                            {isChainLoading && pendingChainId === SUPPORTED_CHAIN_ID && <Spinner animation="border" variant="white" size="sm" />}
                            <span> Wrong Network</span>
                            </button> 
                        </OverlayTrigger>
                    }

                    {totalUniqueItems > 0 && isConnected && !isRegisterTxSuccess && SUPPORTED_CHAIN_ID === chain?.id &&
                      <button className="btn btn-success btn-lg" disabled={!register || isRegisterLoading || isRegisterTxLoading || hasError || isFetching || isBalanceLoading} onClick={handleRegister}>
                          { (isFetching || isRegisterLoading || isRegisterTxLoading || isBalanceLoading) && <Spinner animation="border" variant="white" size="sm" /> }
                          { isRegisterTxLoading && <> Waiting for transaction... </> }
                          { !isRegisterTxSuccess && !isRegisterTxLoading && isAvailableBalance() &&  <> Register </>}
                          { isRegisterTxSuccess && <>Completed</>}
                          { !isFetching && !isAvailableBalance() && <> Unsufficient Balance</>}
                      </button>
                    }
                  </>
                }
            </div>
          </div>
        </div> 
      </div> 
    </>
  );
};

   

function Price({isError, isFetching, price, ethPrice, quoteSymbol, priceInUsd}) {
   
  if(isError) return (<span className="text-danger"><ExclamationCircleFill /></span>)
  if(isFetching) return (<Spinner animation="border" variant="dark" size="sm" />)
  if(!isError && !isFetching) {
    price = Number(ethers.utils.formatUnits(price || 0));
    let symbol = "ETH";
    let format = "0.0000";

    if(!ethPrice)
      ethPrice = 0;

    if(priceInUsd && ethPrice) {
      price = ethPrice * price; 
    }

    if(priceInUsd) {
      symbol = quoteSymbol;
      format = "0.00";
    }

    return (<span><Numeral value={price} format={format} /> {symbol}</span>)
  }
}

export default Register; 