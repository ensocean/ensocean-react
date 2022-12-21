import { Link } from "react-router-dom";

const Carousel = () => {
    return (
    <div className="container-fluid bg-primary mb-4">
        <div className="container">
            <div id="carouselhome" className="carousel slide">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselhome" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                 <button type="button" data-bs-target="#carouselhome" data-bs-slide-to="1" aria-label="Slide 2"></button> 
                 <button type="button" data-bs-target="#carouselhome" data-bs-slide-to="2" aria-label="Slide 3"></button>  
                </div>
                <div className="carousel-inner"> 
                    <div className="carousel-item active pt-5 pb-5 mt-4 mb-4">
                        <div className="jumbotron text-white text-center">
                        <h2 className="display-4">Catch Expired ENS Domains</h2>
                        <p className="lead">EnsOcean makes it easier to find, filter, buy dropped ENS domains. Catch exclusive domains before anyone else.</p>
                        <p className="lead">
                            <Link className="btn btn-primary btn-lg btn-warning" to="/expired" title="Catch Just Dropped Domains" role="button">Catch Now</Link>
                        </p>
                        </div>
                    </div> 
                    <div className="carousel-item pt-5 pb-5 mt-4 mb-4"> 
                        <div className="jumbotron text-white text-center">
                        <h2 className="display-4">Deep Dive Into Etherum Name Service</h2>
                        <p className="lead">Your are looking for a web3 name and you don't have an idea? Use our name generator tool to find a great name!. </p>
                        <p className="lead">
                            <Link className="btn btn-primary btn-lg btn-warning" to="/find" role="button">Find Now</Link>
                        </p>
                        </div> 
                    </div>
                    
                    <div className="carousel-item pt-5 pb-5 mt-4 mb-4">
                        <div className="jumbotron text-white text-center">
                        <h2 className="display-4">Discover ENS Domains</h2>
                        <p className="lead">Having trouble finding a name? We encourage you to browse over millions of ENS domains.</p>
                        <p></p>
                        <p className="lead">
                            <Link className="btn btn-primary btn-lg btn-warning" to="/discover" role="button">Browse</Link>
                        </p>
                        </div>
                    </div>  
                </div> 
            </div>
        </div>
    </div>
    )
}

export default Carousel;