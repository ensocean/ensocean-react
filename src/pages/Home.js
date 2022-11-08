import Carousel from "./partials/Carousel";
import RecentExpired from "./partials/RecentlyExpired";
import RecentRegistered from "./partials/RecentlyRegistered";
 
const Home = () => { 
  return (
      <> 
        <Carousel />
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
            <RecentExpired />
            </div>
            <div className="col-lg-6">
            <RecentRegistered />
            </div>
          </div>
        </div>
      </>
  );
};
 
export default Home;