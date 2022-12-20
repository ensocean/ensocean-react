import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Overlay, OverlayTrigger, Popover } from 'react-bootstrap';
import { FuelPump } from 'react-bootstrap-icons';
import Numeral from 'react-numeral';

// const API_URL = "https://beaconcha.in/api/v1/execution/gasnow";
const API_URL = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=FS1QSVDXCPUFGE1VCX74EQJKZ4JG8WE8SI";

function GasPriceButton() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const target = useRef(null);

    const fetchData = ()=> {
        fetch(API_URL)
        .then(res => res.json())
        .then(
        (data) => { 
            setIsLoaded(true);
            setData(data);
        },
        (error) => {
            setIsLoaded(true);
            setError(error);
        }
        )
    }

    useEffect(()=> {
        fetchData();
    }, []) 

    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Gas Tracker</Popover.Header>
          <Popover.Body>
         {isLoaded && data &&
           <>
           <div className='d-flex flex-row justify-content-between'>
                <span>High</span>
                <span>{data.result.FastGasPrice}</span>
           </div>
           <div className='d-flex flex-row justify-content-between'>
                <span>Avarage</span>
                <span>{data.result.ProposeGasPrice}</span>
           </div>
           <div className='d-flex flex-row justify-content-between'>
                <span>Low</span>
                <span>{data.result.SafeGasPrice}</span>
           </div>
           </>
           }
          </Popover.Body>
        </Popover>
      );

    return (
        <> 
        <OverlayTrigger trigger="click" placement="left" overlay={popover}>
            <Button className='p-0' variant="default">
                <small className='fw-bold'>
                    <FuelPump />
                        { " " }
                        {!isLoaded && <>...</>}
                        {error && <>!</>}
                        {isLoaded && data && <><Numeral value={data.result.ProposeGasPrice} format={"0"} /> Gwei</>}
                </small> 
            </Button>
        </OverlayTrigger> 
        </>
    )
}

export default GasPriceButton;