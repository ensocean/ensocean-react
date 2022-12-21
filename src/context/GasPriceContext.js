import React, {useEffect, useState} from "react";

// const API_URL = "https://beaconcha.in/api/v1/execution/gasnow";
const API_URL = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=FS1QSVDXCPUFGE1VCX74EQJKZ4JG8WE8SI";

const GasPriceContext = React.createContext();

export const GasPriceProvider = ({ children }) => { 

    const [data, setData] = useState(null);
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
     
    useEffect(()=> {
        setIsLoading(true);
        
        async function fetchData() {
            try {
              const res = await fetch(API_URL);
              const data = await res.json();
              setError(null);
              setData(data);
              setIsLoading(false);
            } catch (err) {
              setData(null);
              setError(err);
              setIsLoading(false);
            }
        }

        fetchData();

        setInterval(fetchData, 10000);
    }, [])
     
    return <GasPriceContext.Provider value={{data, error, isLoading}}>{children}</GasPriceContext.Provider>

}

const useGasPrice = () => React.useContext(GasPriceContext);

export default useGasPrice;