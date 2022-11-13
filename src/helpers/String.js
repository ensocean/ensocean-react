import { utils, BigNumber } from 'ethers'; 
import moment from 'moment';
 
const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);
  

export const obscureAddress = (address) => {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
}

export const obscureLabel = (label, len) => {
    if(getLength(label) > len) {
        return Array.from(label).slice(0, len).join("") + "...";
    } else {
        return label;
    }
}

export const getTokenId = (label) => {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const tokenId = BigNumber.from(labelHash).toString();
    return tokenId;
}


export const getLength = (label) => { 
    return Array.from(label).length;
}

export const getSegmentLength = (label) => { 
    return label.length;
}


export function getExpires(expires) {
    return moment.unix(expires).add(GRACE_PERIOD + PREMIUM_PERIOD, "days").fromNow()
}

export function isExpired(expires) { 
    console.log(( (GRACE_PERIOD + PREMIUM_PERIOD) * 24 * 60 * 60))
    return moment.unix(expires).utc().diff(moment().utc(), "seconds") <= -( (GRACE_PERIOD + PREMIUM_PERIOD) * 24 * 60 * 60)  ;
}

export function isExpiring(expires) {  
    return moment.unix(expires).utc().diff(moment().utc(), "seconds") <= 0 && moment.unix(expires).diff(moment(), "seconds") >= -(GRACE_PERIOD * 24 * 60 * 60);
}

export function isPremium(expires) { 
    return moment.unix(expires).utc().diff(moment(), "seconds") <= -GRACE_PERIOD && moment.unix(expires).diff(moment(), "seconds") >= -((GRACE_PERIOD + PREMIUM_PERIOD) * 24 * 60 * 60)  ;
}
 
 
 
 