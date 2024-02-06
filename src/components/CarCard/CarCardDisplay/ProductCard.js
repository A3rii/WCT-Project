/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { db, auth } from './../../../Firebase/firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Modal, } from 'react-bootstrap';
import "./CarCardStyle.css"
import "./../../../App.css"

const ProductList = () => {
   const [products, setProducts] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [showModal, setShowModal] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [showComparisonModal, setShowComparisonModal] = useState(false);
   const [selectedProductsForComparison, setSelectedProductsForComparison] = useState([]);
   const [filter, setFilter] = useState({
      minPrice: "",
      maxPrice: "",
      discount: "",
   });
   const navigate = useNavigate();


   useEffect(() => {
      const fetchProducts = async () => {

         const productsCollection = collection(db, 'posting');
         const productsSnapshot = await getDocs(productsCollection);
         const productsData = productsSnapshot.docs.map((doc) => {
            const data = doc.data();
            const discountedPrice = calculateDiscountedPrice(data.product_price, data.discount);

            return {
               id: doc.id,
               ...data,
               discountedPrice,
            };
         });

         setProducts(productsData);
      };

      fetchProducts();
   }, []);
   const handleViewDetail = (product) => {
      setSelectedProduct(product);
      setShowModal(true);
   };

   const handleCloseModal = () => {
      setShowModal(false);
   };

   const handleFilterChange = (field, value) => {
      setFilter({
         ...filter,
         [field]: value,
      });
   };

   const filteredProducts = products
      .filter((product) => (
         ((filter.minPrice === "" && filter.maxPrice === "") ||
            (parseFloat(product.product_price) >= parseFloat(filter.minPrice) &&
               parseFloat(product.product_price) <= parseFloat(filter.maxPrice))) &&
         (searchTerm === "" || product.product_make.toLowerCase().includes(searchTerm.toLowerCase())) &&
         (!filter.discount || parseFloat(product.discount || 0) >= parseFloat(filter.discount))
      ));

   // To check if user sign in or not 
   const handleAddToFavorites = async (product) => {
      const user = auth.currentUser;
      if (!user) {
         navigate('/SignIn');
         alert("You are not logged in")
         return;
      }

      const currentUserUID = user.uid;

      const productFavoriteRef = collection(db, 'users', currentUserUID, 'Product_Favorite');

      const existingFavorite = await getDocs(productFavoriteRef);
      const alreadyInFavorites = existingFavorite.docs.some((doc) => doc.id === product.id);

      if (!alreadyInFavorites) {
         const favoriteDocRef = doc(productFavoriteRef, product.id);
         await setDoc(favoriteDocRef, product);
         alert("Product Added! ")
      }
   };


   // Add to compare modal // 
   const handleAddToComparison = (product) => {
      const isProductSelected = selectedProductsForComparison.some((selectedProduct) => selectedProduct.id === product.id);

      if (!isProductSelected) {
         if (selectedProductsForComparison.length < 2) {
            setSelectedProductsForComparison((prevProducts) => [...prevProducts, product]); // add only 2 product only
         } else {
            alert("You can only compare up to 2 cars.");
         }
      } else {
         setSelectedProductsForComparison((prevProducts) => prevProducts.filter((selectedProduct) => selectedProduct.id !== product.id));
      }
   };

   const handleOpenComparisonModal = () => {
      if (selectedProductsForComparison.length > 0) {
         setShowComparisonModal(true);
      } else {
         alert("Please select cars for comparison.");
      }
   };

   const handleCloseComparisonModal = () => {
      setShowComparisonModal(false);
      setSelectedProductsForComparison([]);
   };

   const calculateDiscountedPrice = (originalPrice, discount) => {
      if (discount && discount > 0 && discount < 100) {
         const discountedAmount = (discount / 100) * originalPrice;
         return originalPrice - discountedAmount;
      }
      return null;
   };


   return (
      <>

         <div className="shopping-header">
            <h1 className='shopping-title'> Vehicles for Sales</h1>

            <input
               className="searchInput-shopping"
               type="text"
               placeholder="Search here..."
               onChange={(event) => setSearchTerm(event.target.value)}
            />


         </div>


         <div className='inventory-container'>

            <div className='filtter-product'>
               <button className="btn btn-primary carCompare-btn" onClick={handleOpenComparisonModal}>Compare Selected Cars</button>
               <form className="filter-form">
                  <label htmlFor="minPrice" className="form-label">Min Price:</label>
                  <input
                     type="number"
                     id="minPrice"
                     name="minPrice"
                     placeholder="Enter min price"
                     className="form-input"
                     onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  />

                  <label htmlFor="maxPrice" className="form-label">Max Price:</label>
                  <input
                     type="number"
                     id="maxPrice"
                     name="maxPrice"
                     placeholder="Enter max price"
                     className="form-input"
                     onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  />

                  <label htmlFor="discount" className="form-label">Discount:</label>
                  <input
                     type="number"
                     id="discount"
                     name="discount"
                     placeholder="Enter discount percentage"
                     className="form-input"
                     onChange={(e) => handleFilterChange("discount", e.target.value)}
                  />


               </form>
            </div>

            <div className="product-wrapper">
               {filteredProducts.map((product) => (
                  <div className="card card-buy" key={product.id}>
                     <img src={product.product_photoURL} className="card-img-top" alt="#" />
                     <div className="card-body car-buy-body">
                        {product.discountedPrice && (
                           <div className="discount-banner">
                              <span className="discount-text">Discounted {product.discount}% TO</span>
                              <span>${product.discountedPrice.toFixed(2)}</span>
                           </div>
                        )}
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


                        <div className="mt-3 btn-addToFavorite">
                           <button className="btn btn-success" onClick={() => handleViewDetail(product)}> View Detail </button>

                           <div className="addToFavorite-compare">
                              <span className='addToFavorite' onClick={() => handleAddToFavorites(product)}><i class="fa-solid fa-bookmark"></i>Add Favorites </span>
                              <span className='addToFavorite' onClick={() => handleAddToComparison(product)}><i class="fa-solid fa-code-compare"></i>Add Compare </span>

                           </div>
                        </div>



                     </div>
                  </div>
               ))}
            </div>



            <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-fullscreen" >
               <Modal.Header closeButton>
                  <Modal.Title><h2>{selectedProduct && selectedProduct.product_make} </h2></Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div class="carousel slide carousel-medium"
                     id="carouselDemo"
                     data-bs-wrap="true"
                     data-bs-ride="carousel">

                     <div class="carousel-inner">

                        <div class="carousel-item active">
                           <img src={selectedProduct && selectedProduct.product_photoURL} class="w-100" alt="#" />
                        </div>

                        <div class="carousel-item"
                           data-bs-interval="2000">
                           <img src={selectedProduct && selectedProduct.product_photoURL} class="w-100" alt="#" />

                        </div>

                        <div class="carousel-item">
                           <img src={selectedProduct && selectedProduct.product_photoURL} class="w-100" alt="#" />

                        </div>

                     </div>

                     <button class="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselDemo"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                     </button>

                     <button class="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselDemo"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                     </button>

                     <div class="carousel-indicators">
                        <button type="button" class="active view-car"
                           data-bs-target="#carouselDemo"
                           data-bs-slide-to="0">
                           <img src={selectedProduct && selectedProduct.product_photoURL} class="w-100" alt="#" />
                        </button>

                        <button type="button"
                           class="active view-car"
                           data-bs-target="#carouselDemo"
                           data-bs-slide-to="1">
                           <img src={selectedProduct && selectedProduct.product_photoURL} class="w-100" alt="#" />
                        </button>

                        <button type="button"
                           class="active view-car"
                           data-bs-target="#carouselDemo"
                           data-bs-slide-to="2">
                           <img src={selectedProduct && selectedProduct.product_photoURL} class="w-100 " alt="#" />
                        </button>
                     </div>

                  </div>
                  <div class="dealer-purchase">
                     <h2 className="contactDealer-Information"> Contact Number: {selectedProduct && selectedProduct.userPhone}</h2>
                     <p className='button-priceDeatil'>Price: ${selectedProduct && selectedProduct.product_price}</p>
                  </div>
                  <div className="detail-modal">

                     <div className="column_contacts">
                        <h2>Dealer Inforamtion</h2>
                        <table className="table-product">
                           <tr>
                              <td className="attributes">Dealer's Name</td>
                              <td className="values">{selectedProduct && selectedProduct.user_name}</td>
                           </tr>


                           <tr>
                              <td className="attributes">Phone Number </td>
                              <td className="values">{selectedProduct && selectedProduct.userPhone}</td>
                           </tr>


                           <tr>
                              <td className="attributes">Email </td>
                              <td className="values">{selectedProduct && selectedProduct.user_email}</td>
                           </tr>
                        </table>
                     </div>

                     <div className="column">
                        <h2 >Car Details</h2>
                        <table className="table-product">
                           <tr>
                              <td className="attributes">Car Makes</td>
                              <td className="values">{selectedProduct && selectedProduct.product_make}</td>
                           </tr>

                           <tr>
                              <td className="attributes">Car Model</td>
                              <td className="values">{selectedProduct && selectedProduct.product_model}</td>
                           </tr>


                           <tr>
                              <td className="attributes">Car Year</td>
                              <td className="values">{selectedProduct && selectedProduct.product_year}</td>
                           </tr>

                           <tr>
                              <td className="attributes">Car Seat</td>
                              <td className="values">{selectedProduct && selectedProduct.product_seat}</td>
                           </tr>

                           <tr>
                              <td className="attributes">Condition</td>
                              <td className="values">{selectedProduct && selectedProduct.product_condition}</td>
                           </tr>

                           <tr>
                              <td className="attributes">Power</td>
                              <td className="values">{selectedProduct && selectedProduct.product_power}hp</td>
                           </tr>

                           <tr>
                              <td className="attributes">Engine</td>
                              <td className="values">{selectedProduct && selectedProduct.product_engine}</td>
                           </tr>


                           <tr>
                              <td className="attributes">Transmission</td>
                              <td className="values">{selectedProduct && selectedProduct.product_transmission}</td>
                           </tr>


                           <tr>
                              <td className="attributes">Fuel Type </td>
                              <td className="values">{selectedProduct && selectedProduct.product_fuelType}</td>
                           </tr>

                        </table>
                     </div>
                  </div>
               </Modal.Body>
            </Modal>
         </div>



         <Modal show={showComparisonModal} onHide={handleCloseComparisonModal} dialogClassName="modal-fullscreen">
            <Modal.Header closeButton>
               <Modal.Title><h2>Car Comparison</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <h3 className='CarComparison-topic'>Selected Cars for Comparison:</h3>

               <div className="comparison-container">
                  <div className="comparison-represent">
                     <span>Make</span>
                     <span>Model</span>
                     <span>Year</span>
                     <span>Seat</span>
                     <span>Power</span>
                     <span>Engine</span>
                     <span>Price</span>

                  </div>
                  {selectedProductsForComparison.map((product, index) => (

                     <div className="product-compare" key={index}>
                        <img src={product.product_photoURL} alt="#" />
                        <table className='table-compare'>

                           <tbody>
                              <tr>
                                 <td className="value">{product.product_make}</td>
                              </tr>
                              <tr>
                                 <td className="value">{product.product_model}</td>
                              </tr>
                              <tr>
                                 <td className="value">{product.product_year}</td>
                              </tr>

                              <tr>
                                 <td className="value">{product.product_seat}</td>
                              </tr>
                              <tr>
                                 <td className="value">{product.product_power}hp</td>
                              </tr>
                              <tr>
                                 <td className="value">{product.product_engine}</td>
                              </tr>
                              <tr>
                                 <td className="value">${product.product_price}</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  ))}
               </div>

            </Modal.Body>
         </Modal>

      </>
   )
}

export default ProductList;
