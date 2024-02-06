import "./../HomePage/HomeStyle.css"
import AppLayout from "./../../Layout/AppLayout.js"
import { Bmw_logo } from "./../../../assets/HomeImage/Images.js";

export default function ContactPage() {
   return (
      <AppLayout >
         <div className="container mt-5 about-us">
            <div className="d-none d-xxl-block about-image">
               <img src={Bmw_logo} alt="car" />
            </div>
            <div className="information">
               <div className="header-name">
                  <h2>About Us</h2>
               </div>
               <div className="info-context">
                  <p>Welcome to CAR DEALERSHIP, where automotive excellence meets unparalleled customer service. As a premier
                     destination for automotive enthusiasts, we take pride in providing a comprehensive and rewarding
                     car-buying experience. At CAR DEALERSHIP, we believe that finding the perfect vehicle should be as
                     enjoyable as driving it.</p>
               </div>
               <div className="readmore-btn">
                  <button className="btn btn-lg btn-success">
                     Read More
                  </button>
               </div>
            </div>
         </div>
      </AppLayout>
   );
};
