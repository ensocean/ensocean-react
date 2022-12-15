

import  "bootstrap/dist/js/bootstrap.esm.min.js"; 
import "./App.scss";
import './App.css'; 
 
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Faq from "./pages/Faq";
import Discover from './pages/Discover'; 
import Domain from './pages/Domain';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Account from "./pages/Account"; 
import Find from "./pages/Find";
import Register from "./pages/Register";
import NotFound from "./pages/Notfound";    
import Layouts from "./pages/layouts";    
import { CartProvider } from "react-use-cart";
import { WatchlistProvider } from "react-use-watchlist";
import Watchlist from "./pages/Watchlist";

import '@rainbow-me/rainbowkit/styles.css';

import { 
  RainbowKitProvider,
  connectorsForWallets
} from '@rainbow-me/rainbowkit';

import { 
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  coinbaseWallet,
  metaMaskWallet
} from '@rainbow-me/rainbowkit/wallets';

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura'; 
import Registered from "./pages/Registered";
import Expired from "./pages/Expired";
import Expiring from "./pages/Expiring";
import Premium from "./pages/Premium";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_API_URL,
  cache: new InMemoryCache() 
});
   
const { chains, provider } = configureChains(
  [chain[process.env.REACT_APP_SUPPORTED_NETWORK]],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY, priority: 0, weight: 1 }),
    infuraProvider({ apiKey: process.env.REACT_APP_INFURA_KEY, priority: 1, weight: 2 }),
  ]
);
 
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [ 
      metaMaskWallet({chains}),
      coinbaseWallet({chains}),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }), 
      trustWallet({chains})
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});
  
export default function App () {  
  return (  
      <CartProvider id={"ensocean_bulkregister_cart"}> 
        <WatchlistProvider  id={"ensocean_favorites"}> 
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ApolloProvider client={client}> 
                <React.StrictMode>
                  <BrowserRouter forceRefresh={true}>
                    <Routes>  
                      <Route path="/" element={<Layouts.Home />}>
                        <Route index element={<Home />}  />
                      </Route>
                      <Route path="/" element={<Layouts.Home />}>
                        <Route path="/:label.:extension" element={<Domain />} />
                      </Route>
                      <Route path="/find" element={<Layouts.Page />}>
                        <Route path="/find" element={<Find />} />
                      </Route>
                      <Route path="/register" element={<Layouts.Page />}>
                        <Route path="/register" element={<Register />} />
                      </Route>
                      <Route path="/watchlist" element={<Layouts.Watchlist />}>
                        <Route path="/watchlist" forceRefresh={true} element={<Watchlist />} />
                      </Route>
                      <Route path="/" element={<Layouts.Page />}>
                        <Route index element={<Home />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/faq" element={<Faq />} />
                        <Route path="/discover" forceRefresh={true} element={<Discover />} />
                        <Route path="/expired" forceRefresh={true} element={<Expired />} />
                        <Route path="/expiring" forceRefresh={true} element={<Expiring />} />
                        <Route path="/premium" forceRefresh={true} element={<Premium />} />
                        <Route path="/registered" forceRefresh={true} element={<Registered />} />
                        <Route path="/404" element={<NotFound />} /> 
                        <Route path="/account/:address" element={<Account />} /> 
                        <Route path="*" element={<Navigate replace={true} to="/404" />} />
                      </Route> 
                    </Routes>
                  </BrowserRouter>
                  <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} theme="light"></ToastContainer>
                </React.StrictMode>
              </ApolloProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </WatchlistProvider>
      </CartProvider> 
  );
}
