import { utils, BigNumber } from 'ethers'; 
 
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
 
 
 