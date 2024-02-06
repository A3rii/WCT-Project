// src/components/SignUpForm.js
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "./../../../Firebase/firebase";
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { logIn } from "./../../../redux/slice"
import "./../SignUpPage/SignUpStyle.css"

const SignUpForm = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState(null);
   const [successMessage, setSuccessMessage] = useState(null);
   const dispatch = useDispatch()
   const navigate = useNavigate();
   const handleSignIn = async () => {
      try {
         const userCredential = await signInWithEmailAndPassword(auth, email, password);
         console.log('User signed in successfully:', userCredential);


         const userDocRef = doc(db, 'users', userCredential.user.uid);
         const userDocSnapshot = await getDoc(userDocRef);


         console.log(userDocSnapshot.data());

         const user_data = userDocSnapshot.data();

         setEmail('');
         setPassword('');
         setSuccessMessage('User signed in successfully!');

         dispatch(logIn({
            user_name: user_data.display_name,
            email: user_data.email,
            isAdmin: user_data.isAdmin,
            role: user_data.role
         }))

         const user = userCredential.user;
         await updateProfile(user, {
            displayName: user_data.display_name,
         });


         if (user_data.isAdmin) {
            navigate("/Card");
         } else {
            if (user_data.role === 'dealer' || user_data.role === 'user') {
               navigate("/");
            }
         }


      } catch (error) {
         const errorMessage = error.message;
         console.error('Error signing in:', errorMessage);
         setError(errorMessage);
      }
   };

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) {
            console.log('User is signed in:', user.displayName);
         } else {
            console.log('No user is signed in.');
         }
      });

      return () => unsubscribe();
   }, []);





   return (
      <div className="login-container">
         <h2 className="signup-title">Sign In</h2>
         <label className="signup-label">
            Email:
            <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder='Enter your email'
               className="signup-input"
            />
         </label>
         <label className="signup-label">
            Password:
            <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder='Enter your password'
               className="signup-input"


            />
         </label>
         {error && <p className="signup-error" style={{ color: 'red' }}>{error}</p>}
         {successMessage && <p className="signup-success" style={{ color: 'green' }}>{successMessage}</p>}

         <button onClick={handleSignIn} className="signup-button">Sign In</button>
         <p className='haveAccount'>
            Don't have an account?{' '}
            <span>
               <Link to="/SignUp">Sign Up or</Link>
               <Link to="/"> Home</Link>
            </span>
         </p>

      </div>
   );
};

export default SignUpForm;
