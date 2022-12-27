import React, {useEffect, useState} from "react";

const API_URL = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";

const EthPriceContext = React.createContext();

export const EthPriceProvider = ({ children }) => { 

    const [price, setPrice] = useState(null);
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
     
    async function fetchData() {
      setIsLoading(true);
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

    async function refetch() {   
      fetchData(); 
    }
    
    useEffect(()=> { 
      refetch();
      setInterval(fetchData, 10000);
    }, [])
     
    return <EthPriceContext.Provider value={{price, error, isLoading, refetch}}>{children}</EthPriceContext.Provider>

}

const useEthPrice = () => React.useContext(EthPriceContext);

export default useEthPrice;