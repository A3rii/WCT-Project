import React, { useState, useEffect } from "react";
import { db, auth } from "./../../Firebase/firebase";
import AppLayout from "../../views/Layout/AppLayout";
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import "./favoriteStyle.css";

const AddToFavorite = () => {
   const [favorite, setFavorite] = useState([]);
   const user = auth.currentUser;

   useEffect(() => {
      const fetchProducts_Dealer = async () => {
         if (user) {
            const productsCollection = collection(db, 'users', user.uid, 'Product_Favorite');
            const productsSnapshot = await getDocs(productsCollection);
            const productsData = productsSnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            setFavorite(productsData);
         } else {
            console.log("User not logged in");
         }
      };
      fetchProducts_Dealer();
   }, [user]);

   const handleRemoveFromFavorites = async (id) => {
      try {
         const user = auth.currentUser;
         if (!user) throw new Error("You are not logged in.");

         const deleteProductFavorite = doc(db, 'users', user.uid, 'Product_Favorite', id);
         await deleteDoc(deleteProductFavorite);

         setFavorite((prevProducts) => prevProducts.filter(product => product.id !== id));
      } catch (error) {
         console.error('Error removing from favorites:', error.message);
      }
   };

   return (
      <AppLayout>
         <div className="header-favorite">
            <h3 className="heading-favorite">Your Favorite List </h3>
         </div>
         <div className="favorite-list">
            {favorite.length === 0 ? (
               <p>No favorite products yet.</p>
            ) : (
               favorite.map((product) => (
                  <div className="cart-product" key={product.id}>
                     <img src={product.product_photoURL} alt={product.product_make} />
                     <div className="product-info">
                        <div className="makeAndModel">
                           <h3>{product.product_make}</h3>
                           <span className="product-price">
                              Model: {product.product_model}
                           </span>
                        </div>
                        <div className="priceAndname">
                           <span className="product-price">
                              Price: ${product.product_price}
                           </span>
                           <span className="product-price">
                              Seller: {product.user_name}
                           </span>
                        </div>
                     </div>
                     <button
                        className="btn remove-btn"
                        onClick={() => handleRemoveFromFavorites(product.id)}
                     >
                        Remove
                     </button>
                  </div>
               ))
            )}
         </div>
      </AppLayout>
   );
};

export default AddToFavorite;
