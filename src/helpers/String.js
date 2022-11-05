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