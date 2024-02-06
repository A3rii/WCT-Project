import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from "./../../../Firebase/firebase";
import { useNavigate, Link } from "react-router-dom"
import "./SignUpStyle.css"

const SignUpForm = () => {

   const navigate = useNavigate()

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [role, setRole] = useState('');
   const [isAdmin, setIsAdmin] = useState('');
   const [error, setError] = useState(null);
   const [successMessage, setSuccessMessage] = useState(null);


   const handleSignUp = async () => {
      try {
         const userCredential = await createUserWithEmailAndPassword(auth, email, password, phoneNumber, isAdmin, role);

         const userId = userCredential.user.uid;

         const userRef = doc(collection(db, 'users'), userId);
         await setDoc(userRef, {
            display_name: name,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            isAdmin: false,
            role: role,
            signup_timestamp: serverTimestamp(),

         });
         setName('');
         setEmail('');
         setPassword('');
         setPhoneNumber('');
         setRole('');
         alert("login Successful");
         setSuccessMessage('User signed up successfully!')


         const user = userCredential.user;
         await updateProfile(user, {
            displayName: name,
         });


         if (role === "dealer" || role === "user") {
            navigate("/")
         }



      } catch (error) {
         const errorMessage = error.message;
         console.error('Error signing up:', errorMessage);
         setError(errorMessage);
      }
   };



   return (
      <div className="signup-container">
         <h2 className="signup-title">Sign Up</h2>

         <label className="signup-label">
            Name:
            <input
               type="text"
               value={name}
               placeholder='Enter your name'
               onChange={(e) => setName(e.target.value)}
               className="signup-input"
            />
         </label>

         <label className="signup-label" htmlFor="roleSelect">
            Choose a role:
         </label>
         <select
            id="roleSelect"
            onChange={(e) => setRole(e.target.value)}
            className="signup-select"
         >
            <option disabled selected>
               Select an option
            </option>
            <option value="user">User</option>
            <option value="dealer">Dealer</option>
         </select>

         <label className="signup-label">
            Email:
            <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="signup-input"
               placeholder='Enter your email'
            />
         </label>

         <label className="signup-label">
            Password:
            <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="signup-input"
               placeholder='Enter your password'
            />
         </label>

         <label className="signup-label">
            Phone Number:
            <input
               type="text"
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
               className="signup-input"
               placeholder='Enter your phone number'
            />
         </label>

         {error && <p className="signup-error">{error}</p>}
         {successMessage && <p className="signup-success">{successMessage}</p>}

         <button onClick={handleSignUp} className="signup-button">
            Sign Up
         </button>
         <p className='haveAccount'>
            Already have an account?{' '}
            <span>
               <Link to="/SignIn">Login or</Link>
               <Link to="/"> Home</Link>
            </span>
         </p>
      </div>
   );
};

export default SignUpForm;
