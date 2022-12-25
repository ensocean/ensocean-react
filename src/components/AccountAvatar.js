

import spinner from '../assets/spinner.svg'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getTokenId } from '../helpers/String';
import notAvailable from "../assets/not-available.svg";
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEnsName } from 'wagmi';
 
const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;

function AccountAvatar({data}) {   
    const { address}  = useParams();
    const { data: ensName } = useEnsName({ address, staleTime: 2_000, cacheTime: 2_000 })
    const imgRef = useRef();

    const handleError = (e) => {
        imgRef.current.classList.add("d-none"); 
        e.target.src = notAvailable; 
        e.target.alt="Not available";
    }

    const handleAfterLoad = (e) => {
        imgRef.current.classList.add("d-none");
    }

    const getImageSrc = () => {
        return ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(ensName.replace(".eth", "")));
    }

    return (
        <>   
            <LazyLoadImage 
                alt={address} 
                className="img-fluid card-img-top card-img-bottom rounded-1"
                onError={handleError}
                afterLoad={handleAfterLoad}
                placeholder={<img src={spinner} width={100} height={100} className="img-fluid card-img-top card-img-bottom" alt="Loading..." />}
                placeholderSrc={spinner} 
                width={100} 
                height={100}
                src={getImageSrc}
            />  
            <img ref={imgRef} width={100} height={100} src={spinner} className="img-fluid card-img-top card-img-bottom position-absolute top-0 start-0" alt={address} />
        </>
    );
}
    
export default AccountAvatar;
                            
                            
