# ensocean-react

## 1. Install Dependencies
```shell
npm install
```

## 2. Start App
```shell
npm start
```
 

 <div className="d-flex flex-column gap-4 justify-content-center align-items-center mt-3">   
            <div className="d-flex flex-column justify-content-center align-items-center gap-4 mt-3">
              <CountdownCircleTimer
                isPlaying
                duration={60} 
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                onComplete={(e)=> setStep(3)}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h4>Wait for 1 Minute</h4>
              <p>
                The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request.
              </p>
            </div>
          </div>

 <div className="position-relative m-4">
          <div className="progress" style={{height: 1}}>
            <div className="progress-bar" role="progressbar" style={{ width: (step === 2 ? "50%": (step === 3 ? "100%": ""))  }} ></div>
          </div>
          <span className={"position-absolute top-0 start-0 translate-middle text-white pt-2 pb-2 ps-3 pe-3 rounded-circle " + (step === 1 || step === 2 || step === 3 ? "bg-primary" : "bg-secondary") }>1</span>
          <span className={"position-absolute top-0 start-50 translate-middle  text-white pt-2 pb-2 ps-3 pe-3  rounded-circle " + (step == 2 || step === 3 ? "bg-primary" : "bg-secondary")  }>2</span>
          <span className={"position-absolute top-0 start-100 translate-middle  text-white pt-2 pb-2 ps-3 pe-3  rounded-circle " + (step == 3 ? "bg-primary" : "bg-secondary") }>3</span>
        </div> 



const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL);
const contract = new ethers.Contract(ENS_CONTROLLER_ADDRESS, EnsControllerAbi, provider);
// contract.available(this.props.label).then((res) => {
 //   this.setState({ available: res });
//});  

<Link to={"/"+ domain.label + "."+ domain.extension} option={domain} position={index} className="text-truncate link-dark text-decoration-none">
                                {domain.label}.{domain.extension}
                                </Link> 
                                {(function(){
                                    if(loading) {
                                        return (<div className="spinner-border spinner-border-sm"></div>)
                                    }  else if(!domain.valid) {
                                        return (<span className="badge text-bg-danger">Invalid</span> )
                                    } else {
                                        if(!domain.available) {
                                            if (isPremium(domain.expires) ) { 
                                                return (<span className="badge text-bg-success">Premium</span>)
                                            } else if(isExpiring(domain.expires)) {
                                                return (<span className="badge text-bg-warning">Grace Period</span>)
                                            } else if(isExpired(domain.expires)) { 
                                                return (<span className="badge text-bg-success">Available</span>)
                                            } else {
                                                return (<span className="badge text-bg-secondary">Not Available</span>)
                                            }
                                        } else {
                                            return (<span className="badge text-bg-success">Available</span>)
                                        }
                                    } 
                                })()} 
<a className='btn btn-outline-default' href={"/account/"+ address}>
          { ensName ? obscureName(ensName, 20) : obscureAddress(address) } 
        </a>  

<div className="row">
            <div className="col-lg-12 pt-3">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h6 className='fs-5 m-1'>Suggestions</h6>
                </div>
                <ol className="list-group list-group-flush placeholder-glow">
                  { loading && 
                    <>
                        {[...Array(10)].map((x, i) =>
                        <li key={i} className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex">
                            <span className="placeholder col-4"></span>
                            <span className="placeholder col-2"></span>
                        </li>
                        )}
                    </>     
                  }

                  { !loading && error && 
                      <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-danger'>{error.message}</span></li>
                  }

                  { !loading && !error && options && options.length < 1 &&
                      <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-muted'>No Result</span></li>
                  }

                  { !options &&
                      <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-muted'>Type 3 characters or more</span></li>
                  }

                  {!loading && !error && options && options.length > 0 && 
                      <>
                        {options.map((domain) => (
                          <li key={domain.id} className="list-group-item list-group-item-action p-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <div className="card text-start">
                                     <ImageSmall domain={domain} />
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <DomainLink domain={domain} />
                                </div>
                              </div> 
                          </li>
                        ))}  
                      </>
                  }
                   
                </ol> 
              </div>
            </div>
          </div> 