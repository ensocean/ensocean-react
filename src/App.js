
import "bootstrap/dist/css/bootstrap.min.css";  
import  "bootstrap/dist/js/bootstrap.esm.min.js"; 
import './App.css'; 

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
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
import NotFound from "./pages/Notfound";   
 
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_API_URL,
  cache: new InMemoryCache() 
});
 
export default function App () {  
  return ( 
    <ApolloProvider client={client}> 
    <React.StrictMode>
      <BrowserRouter forceRefresh={true}>
        <Routes>  
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/discover" forceRefresh={true} element={<Discover />} />
            <Route path="/find" element={<Find />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/account/:address" element={<Account />} />
            <Route path="/:label.:extension" element={<Domain />} />
            <Route path="*" element={<Navigate replace={true} to="/404" />} />
          </Route> 
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} theme="light"></ToastContainer>
      </React.StrictMode>
    </ApolloProvider>
  );
}
