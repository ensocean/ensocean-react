import { Link } from "react-router-dom";
import { useCart } from "react-use-cart"; 
import { getLabelHash } from "../helpers/String";

function ViewYourCartButton({domain, label}) {   
    let tempDomain = domain;

    if(domain === undefined) { 
        tempDomain = { id: getLabelHash(label), label: label, extension: "eth", price: 0, expires: null, registered: null, owner: null };
    }

    var _domain = JSON.parse(JSON.stringify(tempDomain));
    _domain.price = 0;
    Object.preventExtensions(_domain);

    const { inCart } = useCart();
      
    if(inCart(_domain.id)) {
        return (
            <Link className="btn btn-primary" to="/register">
                View Your Cart
            </Link>
        )   
    }  
}

export default ViewYourCartButton;

