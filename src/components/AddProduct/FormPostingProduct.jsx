import React, { useState } from 'react';
import { db, auth, storage } from "./../../Firebase/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import Header from "./../../components/Header/Header"

import { v4 } from "uuid"
import "./addStyle.css"



const PostProductForm = () => {
   const [userUID, setUserUID] = useState(null);
   const [photoURL, setPhotoURL] = useState(null);
   const [error, setError] = useState("");



   const [make, setMake] = useState('');
   const [model, setModel] = useState('');
   const [discount, setDiscount] = useState('');
   const [year, setYear] = useState('');
   const [seat, setSeat] = useState('');
   const [power, setPower] = useState('');
   const [price, setPrice] = useState('');
   const [engine, setEngine] = useState('');
   const [fuel, setFuel] = useState('');
   const [transmission, setTransmission] = useState('');
   const [driveTrain, setDriveTrain] = useState('');
   const [condition, setCondition] = useState('');
   const [image, setImage] = useState(null);
   const metadata = {
      contentType: 'image/jpg'
   };



   const handlePostProduct = () => {
      if (image == null) return;
      const imageID = v4();
      const imageFormat = image.type.split("/")[1]
      const imgRef = ref(storage, `posting_image/${imageID + "." + imageFormat}`);
      console.log(imgRef);
      const uploadTask = uploadBytesResumable(imgRef, image, metadata);


      uploadTask.on('state_changed', (snapshot) => {
         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         console.log('Upload is ' + progress + '% done');
      },
         (error) => {
            setError(error)
         },
         async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               setPhotoURL(downloadURL);

            });

            try {
               const user = auth.currentUser;
               if (!user) throw new Error("You are not logging ")
               const userDocRef = doc(db, 'users', user.uid);
               const userDocSnapshot = await getDoc(userDocRef);
               const getUser_name = userDocSnapshot.data();
               const user_posting = getUser_name.display_name;
               const currentUserUID = user.uid;
               setUserUID(currentUserUID);

               const productData = {
                  userId: currentUserUID,
                  user_name: user_posting,
                  userPhone: getUser_name.phoneNumber,
                  user_email: getUser_name.email,
                  discount: parseFloat(discount),
                  product_make: make,
                  product_model: model,
                  product_year: parseFloat(year),
                  product_price: parseFloat(price),
                  product_seat: parseFloat(seat),
                  product_power: parseFloat(power),
                  product_engine: engine,
                  product_fuelType: fuel,
                  product_transmission: transmission,
                  product_driveTrain: driveTrain,
                  product_condition: condition,
                  product_photoURL: downloadURL,
               };
               const resetAllType = () => {
                  setMake('');
                  setModel('');
                  setYear('');
                  setSeat('');
                  setPower('');
                  setEngine('');
                  setPrice('');
                  setDriveTrain('');
                  setFuel('');
                  setDiscount('');
                  setTransmission('');
                  setDriveTrain('');
                  setCondition('');
                  setImage('');
               }
               const productAddRef = collection(db, 'users', currentUserUID, 'Product_Add');
               const docRef = await addDoc(productAddRef, productData);

               // Get ID the Same As product_add to posting collection (Have the same ID as product)
               const productId = docRef.id;

               console.log('Product ID in Product_Add:', productId);

               const postingRef = doc(collection(db, 'posting'), productId);
               await setDoc(postingRef, productData);
               alert("You have successfully posted the product.");
               resetAllType();
            } catch (error) {
               console.error('Error posting product:', error);
            }


         }
      );
   }






   return (
      <>
         <Header />
         <div class="post-product-form">
            <h2 class="form-title">Post a Product</h2>

            <label class="form-label">
               Product Name:
               <input
                  class="form-input"
                  type="text"
                  value={make}
                  required
                  onChange={(e) => setMake(e.target.value)}
               />
            </label>



            <label class="form-label">
               Model:
               <input
                  class="form-input"
                  type="text"
                  value={model}
                  required
                  onChange={(e) => setModel(e.target.value)}
               />
            </label>

            <label class="form-label">
               Year:
               <input
                  class="form-input"
                  type="number"
                  value={year}
                  required
                  onChange={(e) => setYear(e.target.value)}
               />
            </label>

            <label class="form-label">
               Seat:
               <input
                  class="form-input"
                  type="text"
                  value={seat}
                  required
                  onChange={(e) => setSeat(e.target.value)}
               />
            </label>

            <label class="form-label">
               Power:
               <input
                  class="form-input"
                  type="number"
                  value={power}
                  required
                  onChange={(e) => setPower(e.target.value)}
               />
            </label>

            <label class="form-label">
               Price:
               <input
                  class="form-input"
                  type="number"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
               />
            </label>

            <label class="form-label">
               Engine:
               <select className="form-input" onChange={(e) => setEngine(e.target.value)}>
                  <option disabled selected>Select an option</option>
                  <option value="v2">v2</option>
                  <option value="v4">v4</option>
                  <option value="v6">v6</option>
                  <option value="v8">v8</option>
                  <option value="v12">v12</option>
               </select>

            </label>

            <label class="form-label">
               Fuel:
               <select className="form-input" onChange={(e) => setFuel(e.target.value)}>
                  <option disabled selected>Select an option</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Eletrical">Eletrical</option>
                  <option value="Diesel">Diesel</option>
               </select>
            </label>

            <label class="form-label">
               Transmission:
               <select className="form-input" onChange={(e) => setTransmission(e.target.value)}>
                  <option disabled selected>Select an option</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Manual/Automatic">Manual/Automatic</option>
               </select>
            </label>

            <label class="form-label">
               Drive Train:
               <input
                  class="form-input"
                  type="text"
                  value={driveTrain}
                  onChange={(e) => setDriveTrain(e.target.value)}
               />
            </label>
            <label class="form-label">
               Discount
               <input
                  class="form-input"
                  type="number"
                  placeholder='(optional)'
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
               />
            </label>

            <label class="form-label">
               Condition:
               <select className="form-input" onChange={(e) => setCondition(e.target.value)}>
                  <option disabled selected>Select an option</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>

               </select>
            </label>

            <label class="form-label">
               Image:
               <input
                  class="form-input"
                  type="file"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
               />
            </label>

            <button class="form-button" onClick={handlePostProduct}>Post Product</button>
         </div>
      </>
   );

};

export default PostProductForm;
