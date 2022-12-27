import React, {useEffect, useState} from "react";

const API_URL = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";

const EthPriceContext = React.createContext();

export const EthPriceProvider = ({ children }) => { 

    const [price, setPrice] = useState(null);
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
     
    useEffect(()=> {
        setIsLoading(true);
        
        async function fetchData() {
            try {
              const res = await fetch(API_URL);
              const data = await res.json();
              setError(null);
              setPrice(data.USD);
              setIsLoading(false);
            } catch (err) {
              setPrice(null);
              setError(err);
              setIsLoading(false);
            }
        }

        fetchData();

        setInterval(fetchData, 10000);
    }, [])
     
    return <EthPriceContext.Provider value={{price, error, isLoading}}>{children}</EthPriceContext.Provider>

}

const useEthPrice = () => React.useContext(EthPriceContext);

export default useEthPrice;