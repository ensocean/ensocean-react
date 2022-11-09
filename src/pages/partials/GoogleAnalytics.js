import  {useEffect} from "react"
import { useLocation } from "react-router-dom"
import ReactGA from "react-ga4"
 
const TRACKING_ID = process.env.REACT_APP_TRACKING_ID;
const NODE_ENV = process.env.REACT_APP_NODE_ENV

export default function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => { 
    ReactGA.initialize(TRACKING_ID, { debug: (NODE_ENV === "development") })
  }, [])

  useEffect(() => { 
    console.log(location.pathname + location.search)
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location])
}