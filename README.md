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