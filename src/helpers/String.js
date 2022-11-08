 import { utils, BigNumber } from 'ethers'; 




export const obscureAddress = (address) => {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
}

export const obscureString = (str, len) => {
    if(str.length > len) {
        return str.substring(0, len) + "...";
    } else {
        return str;
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
 
 
 