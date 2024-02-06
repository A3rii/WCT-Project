import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { db, auth } from './../../../Firebase/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import "./ProductSellerStyle.css"
import "./../../../App.css"
import AppLayout from './../../../views/Layout/AppLayout';




const UpdateModal = ({ productId }) => {
   const [newDiscount, setNewDiscount] = useState('');
   const user = auth.currentUser;

   const handleOnUpdate = async () => {
      try {
         const productRef = doc(db, 'users', user.uid, "Product_Add", productId);
         const productRef_posting = doc(db, 'posting', productId);

         const parsedDiscount = parseFloat(newDiscount);

         await updateDoc(productRef, {
            discount: parsedDiscount,
         });

         await updateDoc(productRef_posting, {
            discount: parsedDiscount,
         });

         setNewDiscount('')
         alert("Your Product has changed successfully")
      } catch (error) {
         console.error("Error updating product:", error.message);
      }
   }

   return (
      <>
         <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">Edit Product</button>

         <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
               <div className="modal-content">
                  <div className="modal-header">
                     <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Your Product </h1>
                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                     <form>

                        <div className="mb-3">
                           <label for="message-text" className="col-form-label">Set Discount</label>
                           <input
                              type="text "
                              className="form-control"
                              onChange={(e) => setNewDiscount(e.target.value)}
                           />
                        </div>
                     </form>
                  </div>



                  <div className="modal-footer">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                     <button
                        type="button"
                        className="btn btn-primary" onClick={handleOnUpdate}>Change</button>
                  </div>
               </div>
            </div>
         </div>
      </>
   )

}



const ProductList = () => {
   const [products_dealer, setProducts_dealer] = useState([]);
   const [products_posting, setProducts_posting] = useState([]);
   const user = auth.currentUser;


   useEffect(() => {
      const fetchProducts_Dealer = async () => {

         const productsCollection = collection(db, 'users', user.uid, "Product_Add");
         const productsSnapshot = await getDocs(productsCollection);
         const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setProducts_dealer(productsData);

      };
      fetchProducts_Dealer();
   });

   useEffect(() => {
      const fetchProducts_Posting = async () => {

         const productsCollection = collection(db, 'posting');
         const productsSnapshot = await getDocs(productsCollection);
         const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setProducts_posting(productsData);

      };
      fetchProducts_Posting();
   });



   const handleDelete_Dealer = async (id) => {
      const deleteProductDealer = doc(db, 'users', user.uid, "Product_Add", id);
      await deleteDoc(deleteProductDealer);
      setProducts_dealer((prevProducts) => prevProducts.filter(product => product.id !== id));
   }
   const handleDelete_Posting = async (id) => {
      const deleteProductPosting = doc(db, 'posting', id);
      setProducts_posting((prevProducts) => prevProducts.filter(product => product.id !== id));
      await deleteDoc(deleteProductPosting);
   }
   const handleDelete = (id) => {
      handleDelete_Dealer(id)
      handleDelete_Posting(id)
   }

   return (
      <AppLayout>
         <h2 className='product-posted'>Your Product On Posted </h2>

         <div className="dealer-inventory" >
            {products_dealer.length === 0 && products_posting.length === 0 ? (
               <p>No products available.</p>
            ) : (

               products_dealer.map((product) => (
                  <div className="card card-buy-seller " key={product.id}>
                     <img src={product.product_photoURL} className="card-img-top" alt="#" />
                     <div className="card-body car-buy-body-seller ">
                        <h4 className="card-title card-title-make-seller">{product.product_make}</h4>
                        <div className="car-model-seller">
                           <div className="car-make-seller">
                              <h5 className="card-title card-title-model-seller">{product.product_model}</h5>
                              <h5 className="card-title card-title-year-seller">{product.product_year}</h5>
                           </div>

                           <div className="type-card-seller">
                              <h5 className="card-title-seller">Price: ${product.product_price}</h5>
                           </div>
                        </div>

                        <div className="type-card-seller">
                           <h4 className="card-title-seller">Seller: {product.user_name}</h4>
                           <h4 className="card-title-seller">Seat {product.product_seat}</h4>
                        </div>


                        <div className="mt-3 btn-addToFavorite-seller">
                           <UpdateModal productId={product.id} />
                           <button className="btn btn-danger" onClick={() => handleDelete(product.id)} > Delete Product  </button>
                        </div>


                     </div>
                  </div>

               ))
            )}
         </div>
      </AppLayout>
   )
}

export default ProductList;
