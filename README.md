# ensocean-react

## 1. Install Dependencies
```shell
npm install
```

## 2. Start App
```shell
npm start
```
 
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