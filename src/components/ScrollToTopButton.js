

import React, {useEffect, useState} from "react";
import { ArrowUp } from "react-bootstrap-icons";
 
function ScrollToTopButton( ) {   
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      });
    }, []);
   
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
    };

    return (
        <>  
          {showButton && (
            <button onClick={scrollToTop} className="btn btn-lg btn-primary position-fixed bottom-0 end-0 mb-4 me-4">
               <ArrowUp />
            </button>
          )}
        </>
      );
}

export default ScrollToTopButton;

