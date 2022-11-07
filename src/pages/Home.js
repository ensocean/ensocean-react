import Carousel from "./partials/Carousel";
import RecentExpired from "./partials/RecentlyExpired";
import RecentRegistered from "./partials/RecentlyRegistered";
 
const Home = () => { 
  return (
      <> 
        <Carousel />
        <div className="container">
          <div className="row">
            <RecentExpired />
            <RecentRegistered />
          </div>
        </div>
      </>
  );
};
 
export default Home;