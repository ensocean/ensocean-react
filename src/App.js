
import "bootstrap/dist/css/bootstrap.min.css";  
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Faq from "./pages/Faq";
import Discover from './pages/Discover';
import Notfound from './pages/Notfound';
import Domain from './pages/Domain';
import { ToastContainer } from 'react-toastify';
 
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Account from "./pages/Account";
  
import TimeAgo from "javascript-time-ago";  
import en from 'javascript-time-ago/locale/en'
import Find from "./pages/Find";
import NotFound from "./pages/Notfound";

import ReactGA from 'react-ga';

const TRACKING_ID = process.env.REACT_APP_TRACKING_ID;
ReactGA.initialize(TRACKING_ID);
 
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_API_URL,
  cache: new InMemoryCache()
});

export default function App () {
  
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  
  return (
    <ApolloProvider client={client}>
      <BrowserRouter forceRefresh={true}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/find" element={<Find />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/account/:address" element={<Account />} />
            <Route path="/:label.eth" element={<Domain />} />
            <Route path="*" element={<Navigate to="/404"></Navigate>} />
          </Route> 
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} theme="light"></ToastContainer>
    </ApolloProvider>
  );
}
