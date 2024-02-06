import "./../../../App.css"
import "./HomeStyle.css"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header/Header.js";
import Footer from "../../../components/Footer/Footer"
import { db } from "./../../../Firebase/firebase.js";
import { collection, getDocs } from 'firebase/firestore';
import "./../../../components/CarCard/CarCardDisplay/CarCardStyle.css"
import * as Images from "./../../../assets/HomeImage/Images.js";

export default function HomePage() {
   const [discountProducts, setDiscountProducts] = useState([]);

   useEffect(() => {
      const fetchDiscountProducts = async () => {
         try {
            const productsCollection = collection(db, 'posting');
            const productsSnapshot = await getDocs(productsCollection);
            const productsData = productsSnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));

            const filteredDiscountProducts = productsData.filter(product =>
               product.discount > 0
            );

            setDiscountProducts(filteredDiscountProducts);
         } catch (error) {
            console.error("Error fetching products:", error.message);
         }
      };

      fetchDiscountProducts();
   }, []);
   return (
      <>
         <Header />
         <nav className="nav-section">
            <div className="container main">
               <div className="text-banner-1">Premier Auto Sales</div>
               <div className="text-banner-2">Car dealerships may sell new cars from one or several manufacturers</div>
               <Link to="/Shop" >
                  <div className="btn btn-lg btn-success  find-car">
                     <i className="fa-solid fa-car-rear"></i>
                     <span> Find Your Car</span>
                  </div>
               </Link>



               <div className="car-feature">
                  <div className="brand-variety">
                     <i className="fa-solid fa-car"></i>
                     <span id="brand-text">Brand Variety</span>
                  </div>

                  <div className="time-efficiency">
                     <i className="fa-solid fa-clock"></i>
                     <span>Time Efficiency</span>
                  </div>

                  <div className="fast-support">
                     <i className="fa-solid fa-people-arrows"></i>
                     <span>Fast Support</span>
                  </div>

                  <div className="warranty">
                     <i className="fa-solid fa-shield"></i>
                     <span>Warranty</span>
                  </div>

               </div>
            </div>
         </nav>


         <div className="container brand-category">
            <p className="explore-recommend">Explore our discounted car collection</p>
            <div className="card-recommendation">
               {discountProducts.map((product) => (
                  <div className="card card-buy" key={product.id}>
                     {product.discount > 0 && (
                        <div className="discount-banner">
                           <span className="discount-text">Discount {product.discount}% OFF</span>
                        </div>
                     )}
                     <img src={product.product_photoURL} className="card-img-top" alt="#" />
                     <div className="card-body car-buy-body">
                        <div className="make-condition">
                           <h4 className="card-title card-title-make">{product.product_make}</h4>
                           <p className="condition-tite">Condition: {product.product_condition}</p>
                        </div>
                        <div className="car-model">
                           <div className="car-make">
                              <h5 className="card-title card-title-model">{product.product_model}</h5>
                              <h5 className="card-title card-title-year">{product.product_year}</h5>
                           </div>
                           <div className="type-seller">
                              <h5 className="card-title-type">Price: ${product.product_price}</h5>
                           </div>
                        </div>
                        <div className="type-seller">
                           <h4 className="card-title-price">Seller: {product.user_name}</h4>
                           <h4 className="card-title-price">Seat: {product.product_seat}</h4>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

         </div>



         <div className="process">

            <div className="text-process">
               <span>
                  <h2>How Does It Works?</h2>
               </span>
               <span>Here are some of the featured cars in different categories</span>
            </div>

            <div className="flow-process">
               <div className="location">
                  <img src={Images.Phone} alt="map" width="60rem" />
                  <span id="flow-text-1">Choose Any Where</span>
                  <span id="flow-text-2">Car servicing is the regular maintenance and inspection of a vehicle to
                     ensure.</span>
               </div>
               <div className="contact">
                  <img src={Images.GoogleMap} alt="contact" width="60rem" />
                  <span id="flow-text-1">Contact With Us</span>
                  <span id="flow-text-2">Car servicing is the regular maintenance and inspection of a vehicle to
                     ensure.</span>
               </div>
               <div className="pay">
                  <img src={Images.Salary} alt="money" width="60rem" />
                  <span id="flow-text-1">Pay For The Car</span>
                  <span id="flow-text-2">Car servicing is the regular maintenance and inspection of a vehicle to
                     ensure.</span>
               </div>
               <div className="recieve">

                  <img src={Images.Car} alt="car" width="60rem" />
                  <span id="flow-text-1">Recieve The Car</span>
                  <span id="flow-text-2">Car servicing is the regular maintenance and inspection of a vehicle to
                     ensure.</span>
               </div>
            </div>

         </div>

         <Footer />
      </>
   )
}