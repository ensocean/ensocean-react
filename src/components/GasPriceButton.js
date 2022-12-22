import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Overlay, OverlayTrigger, Popover, Spinner } from 'react-bootstrap';
import { FuelPump } from 'react-bootstrap-icons';
import Numeral from 'react-numeral';
import { Link } from 'react-router-dom';
import useGasPrice from '../context/GasPriceContext';

function GasPriceButton() {
    const {data, error, isLoading} = useGasPrice();

    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Gas Tracker</Popover.Header>
          <Popover.Body>
            {!isLoading && data &&
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
            <Link className='text-decoration-none link-dark d-flex flex-row align-items-center gap-1 fw-bold' variant="default" width={50}>
                <FuelPump />
                {isLoading && <> <Spinner animation="border" variant="dark" size="sm" /> Gwei </> }
                {error && <>!</>}
                {!isLoading && data && <small><Numeral value={data.result.ProposeGasPrice} format={"0"} /> Gwei</small>}
            </Link>
        </OverlayTrigger> 
        </>
    )
}

export default GasPriceButton;