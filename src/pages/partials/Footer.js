import { Link } from "react-router-dom";
import logo from "../../assets/icon.png"

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
                                <a href="https://opensea.io/EnsOceanOfficial" target="_blank" rel="noopener" title="View EnsOcean on Opensea">
                                    <svg width="32" height="32" fill="white" className="bi bi-opensea" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
                                        <path d="M10.84,49.44l.28-.43L27.77,23a.56.56,0,0,1,1,.07c2.78,6.23,5.18,14,4.05,18.81A29.52,29.52,0,0,1,29.55,49c-.19.36-.4.72-.62,1.06a.58.58,0,0,1-.48.25H11.33A.57.57,0,0,1,10.84,49.44Z"></path>
                                        <path d="M85.05,54.28V58.4a.58.58,0,0,1-.35.54c-1.29.56-5.71,2.58-7.54,5.13-4.68,6.52-8.26,15.84-16.25,15.84H27.55A21.44,21.44,0,0,1,6.15,58.43v-.38a.57.57,0,0,1,.57-.57h18.6a.63.63,0,0,1,.6.7,6.37,6.37,0,0,0,.66,3.57,6.56,6.56,0,0,0,5.87,3.64h9.2V58.21H32.56a.59.59,0,0,1-.48-.92l.33-.49c.86-1.22,2.09-3.12,3.31-5.29A40,40,0,0,0,38,46.93c.13-.28.24-.57.34-.85.18-.5.36-1,.49-1.44s.24-.81.35-1.19a19.11,19.11,0,0,0,.44-4.2c0-.57,0-1.17-.08-1.74s-.11-1.25-.19-1.87-.15-1.1-.25-1.67c-.13-.84-.32-1.67-.53-2.5l-.07-.32c-.16-.57-.29-1.12-.47-1.69-.52-1.79-1.12-3.54-1.75-5.18-.23-.65-.5-1.28-.76-1.9-.39-.94-.78-1.79-1.14-2.6-.19-.37-.35-.71-.5-1.05s-.37-.77-.55-1.14-.28-.55-.39-.81L31.84,14.7a.36.36,0,0,1,.41-.53l7,1.9h0l.93.26,1,.29.37.1V12.55a3.64,3.64,0,0,1,3.62-3.66A3.56,3.56,0,0,1,47.83,10a3.67,3.67,0,0,1,1.06,2.58v6.21l.75.21a.53.53,0,0,1,.17.08l.78.59c.26.22.55.47.89.73.68.55,1.48,1.25,2.37,2.06.24.21.47.42.68.63,1.14,1.06,2.43,2.31,3.65,3.69.34.39.68.78,1,1.2s.7.83,1,1.25.86,1.12,1.25,1.72c.18.28.39.57.57.86.5.75.94,1.53,1.36,2.32.18.36.36.75.52,1.14A17.5,17.5,0,0,1,65,38.42a4.62,4.62,0,0,1,.15.7v.05a5.36,5.36,0,0,1,.13,1,10.37,10.37,0,0,1-.18,3.28,12.31,12.31,0,0,1-.39,1.37c-.16.45-.32.91-.52,1.36a18.57,18.57,0,0,1-1.41,2.68c-.18.31-.39.65-.6,1s-.47.66-.68,1-.6.81-.91,1.18a10.94,10.94,0,0,1-.89,1.12c-.44.52-.86,1-1.3,1.49-.26.3-.55.62-.84.9s-.57.6-.83.86c-.44.44-.81.79-1.12,1.07l-.72.66a.63.63,0,0,1-.39.15h-5.6v7.18h7a6.56,6.56,0,0,0,4.28-1.58,49.47,49.47,0,0,0,4.36-4.29.5.5,0,0,1,.27-.16l19.47-5.63A.57.57,0,0,1,85.05,54.28Z"></path>
                                    </svg>    
                                </a>        
                            </li>
                            <li className="list-inline-item"> 
                                <a href="https://github.com/ensocean" target="_blank" rel="noopener" title="View EnsOcean on Github">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-github" viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                                    </svg>
                                </a>
                            </li>
                            <li className="list-inline-item"> 
                                <a href="https://twitter.com/ensocean" target="_blank" rel="noopener" title="Follow EnsOcean on Twitter">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-twitter" viewBox="0 0 16 16">
                                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
                                    </svg>
                                </a>
                            </li>   
                            <li className="list-inline-item"> 
                                <a href="https://telegram.me/ensocean" target="_blank" rel="noopener" title="Join EnsOcean Telegram Channel">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-telegram" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"></path>
                                    </svg>
                                </a>
                            </li> 
                            <li className="list-inline-item">
                                <a href="mailto:support@ensocean.com" target="_blank" rel="noopener" title="Contact Via Email" className="text-decoration-none"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"></path>
                                    </svg>
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
                        <li className="list-inline-item"><a href="https://medium.com/the-ethereum-name-service" target="_blank" title="Learn ENS"><small>Learn ENS</small></a></li>
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;