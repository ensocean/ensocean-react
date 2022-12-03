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

const ENS_CONTROLLER_ADDRESS = process.env.REACT_APP_ENS_CONTROLLER_ADDRESS;
const BULK_CONTROLLER_ADDRESS = process.env.REACT_APP_BULK_CONTROLLER_ADDRESS;
const { data, isLoading, isError } = useContractRead({
    addressOrName: BULK_CONTROLLER_ADDRESS,
    contractInterface: bulkControllerAbi,
    functionName: "bulkAvailable",
    args: [ENS_CONTROLLER_ADDRESS, [q]]
});
import { useContract, useContractRead } from 'wagmi';
import bulkControllerAbi from "../../abis/BulkEthRegistrarController.json";