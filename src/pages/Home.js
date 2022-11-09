import Carousel from "./partials/Carousel";
import RecentExpired from "./partials/RecentlyExpired";
import RecentRegistered from "./partials/RecentlyRegistered";
 
const Home = () => { 
  return (
      <> 
        <Carousel />
        <div className="container">
          <div className="row gap-3 gap-lg-0 gap-md-3 gap-sm-3">
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