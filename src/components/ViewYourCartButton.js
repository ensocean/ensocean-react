import { Link } from "react-router-dom";
import { useCart } from "react-use-cart"; 

function ViewYourCartButton({domain}) {   
    const { inCart } = useCart();
      
    if(inCart(domain.id)) {
        return (
            <Link className="btn btn-outline-primary" to="/register">
                View Your Cart
            </Link>
        )   
    }  
}

export default ViewYourCartButton;

