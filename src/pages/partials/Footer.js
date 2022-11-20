import { Link } from "react-router-dom";
import logo from "../../assets/icon.png"
import openSeaIcon from "../../assets/opensea.svg";
import githubIcon from "../../assets/github.svg";
import twitterIcon from "../../assets/twitter.svg";
import telegramIcon from "../../assets/telegram.svg";
import envelopeFillIcon from "../../assets/envelope-fill.svg";

const Footer = () => {
    return (
        <>
            <div className="container-fluid bg-primary p-3 text-center text-white fs-6 mt-5">
                #DeepDiveIntoENS
            </div>
            <div className="footer bg-dark pt-4 text-white">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <img src={logo} alt="EnsOcean" className="float-start me-1" />
                            <h3>EnsOcean</h3>
                            <p>
                                EnsOcean helps you to find your next web3 domain based on ENS. You can find, discover, register and trade your ENS names easily. 
                            </p>
                        </div> 
                        <div className="col-lg-6">
                            <ul className="list-inline list-unstyled float-lg-end float-sm-none">
                            <li className="list-inline-item"> 
                                <a href="https://opensea.io/EnsOceanOfficial" target="_blank" rel="noreferrer" title="View EnsOcean on Opensea">
                                    <img src={openSeaIcon} alt="" />
                                </a>        
                            </li>
                            <li className="list-inline-item"> 
                                <a href="https://github.com/ensocean" target="_blank" rel="noreferrer" title="View EnsOcean on Github">
                                    <img src={githubIcon} alt=""  />
                                </a>
                            </li>
                            <li className="list-inline-item"> 
                                <a href="https://twitter.com/ensocean" target="_blank" rel="noreferrer" title="Follow EnsOcean on Twitter">
                                    <img src={twitterIcon} alt=""  />
                                </a>
                            </li>   
                            <li className="list-inline-item"> 
                                <a href="https://telegram.me/ensocean" target="_blank" rel="noreferrer"  title="Join EnsOcean Telegram Channel">
                                    <img src={telegramIcon} alt=""  />
                                </a>
                            </li> 
                            <li className="list-inline-item">
                                <a href="mailto:support@ensocean.com" target="_blank"  rel="noreferrer" title="Contact Via Email" className="text-decoration-none"> 
                                    <img src={envelopeFillIcon} alt=""  />
                                </a>
                            </li> 
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <div className="row mt-3">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <small className="text-muted">Made with <span className="text-danger">♥</span> © 2022 EnsOcean.</small>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <ul className="list-inline list-unstyled float-lg-end float-md-end float-sm-none">
                        <li className="list-inline-item"><Link to="/privacy" title="Privacy Policy"><small>Privacy</small></Link></li>
                        <li className="list-inline-item"><Link to="/terms" title="Term Of Use"><small>Terms</small></Link></li>
                        <li className="list-inline-item"><Link to="/faq" title="Frequently Asked Questions"><small>FAQ</small></Link></li>
                        <li className="list-inline-item"><a href="https://medium.com/the-ethereum-name-service" target="_blank" rel="noreferrer" title="Learn ENS"><small>Learn ENS</small></a></li>
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;