import user from './user.png';
import edit from './edit.png';
import './AppMenuStyle.css';
import "./../../App.css"
import { Link, useNavigate } from "react-router-dom"
import { auth } from '../../Firebase/firebase'
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/slice';

export default function AppMenuUser({ dealerName }) {
   const [open, setOpen] = useState(false);
   let menuRef = useRef();
   const navigate = useNavigate();
   const dispatch = useDispatch()


   useEffect(() => {
      let handler = (e) => {
         if (!menuRef.current.contains(e.target) && open) {
            setOpen(false);
         }
      };

      document.addEventListener("mousedown", handler);

      return () => {
         document.removeEventListener("mousedown", handler);
      };
   }, [open]);

   const handleSignOut = async () => {
      try {
         await auth.signOut();
         navigate("/");
      } catch (error) {
         console.error("Error signing out:", error.message);
      }
      dispatch(logOut());
   };
   return (
      <div className="app-menu">
         <div className='app-menu-container' ref={menuRef}>
            <div className='app-menu-trigger' onClick={() => { setOpen(!open) }}>
               <img src={user} alt="User Icon"></img>
            </div>

            <div className={`app-dropdown-sidemenu ${open ? 'active' : 'inactive'}`} >
               <h3 className="dealer-name">{dealerName}</h3>
               <ul className='dealer-option'>
                  <DropdownItem img={user} text={"My Profile"} />
                  <Link to="/favorite">
                     <DropdownItem img={edit} text={"Favorite"} />
                  </Link>
                  <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
               </ul>
            </div>
         </div>
      </div>
   );
}



function DropdownItem(props) {
   return (
      <li className='app-dropdownItem'>
         <img src={props.img} alt={props.text}></img>
         <a href="!#"> {props.text}  </a>
      </li>
   );
}