import './HeaderStyle.css'
import "./../../App.css"
import { Link } from "react-router-dom"
import { db } from "./../../Firebase/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux'
import { logIn } from "./../../redux/slice"
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react"
import AppMenu from "./../SideMenu/AppMenu"
import AppMenuUser from './../SideMenu/AppMenuUser';


export default function Header() {

   const [role, setRole] = useState("");

   const auth = getAuth();
   const user = auth.currentUser;
   const user_id = user ? user.uid : null;
   const dispatch = useDispatch();
   const userDocRef = user_id ? doc(db, 'users', user_id) : null;
   const get_userInfo = async () => {
      try {
         if (userDocRef) {
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
               const user_data = userDocSnapshot.data();
               dispatch(logIn({
                  user_name: user_data.display_name,
                  email: user_data.email,
                  isAdmin: user_data.isAdmin,
                  role: user_data.role
               }))
               setRole(user_data.role);
            } else {
               console.log("User document does not exist");
            }
         }
      } catch (error) {
         console.error("Error fetching user data:", error.message);
      }
   };


   console.log(role);
   useEffect(() => {
      get_userInfo();
   });



   const [userName, setUserName] = useState("");
   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) {
            setUserName(user.displayName);
         } else {
            setUserName("");
         }
      });

      return () => unsubscribe();
   });






   return (
      <div >


         <header class="header">
            <span> </span>
            <span id="banner-word">World Best Dealer | Trust-worthy | Best Services</span>
            <div class="icon-header">
               <a href="#!"><i class="fa-brands fa-facebook"></i></a>
               <a href="#!"><i class="fa-brands fa-instagram"></i></a>
            </div>
         </header>



         <header className="search-section">

            <div className="search-left">
               <i class="fa-solid fa-car"></i>
               <span>Car Dealership</span>
            </div>


            <div class="searh-middle">
               <div className="menu">

                  <Link to="/">
                     <li>Home</li>
                  </Link>
                  <Link to="/Shop">
                     <li>Shopping</li>
                  </Link>
                  <Link to="/Contact">
                     <li>Contact</li>
                  </Link>


               </div>
            </div>

            <div className="search-right">
               <>
                  {role === "dealer" && userName ? (
                     <AppMenu dealerName={userName} />
                  ) : role === "user" ? (
                     <AppMenuUser dealerName={userName} />
                  ) : (
                     <>
                        <Link to="/SignIn">Login</Link>
                        <Link to="/SignUp">
                           <button type="button" className="btn btn-success">
                              <i className="fa-solid fa-user"></i> Sign Up
                           </button>
                        </Link>
                     </>
                  )}



               </>

            </div>

         </header>
      </div>
   );
}