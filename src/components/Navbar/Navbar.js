import "./../../App.css"
import "./NavbarStyle.css"
import { NavLink, Outlet } from "react-router-dom";
export default function Navbar() {

   return (
      <>
         <div className="navbar">
            <div></div>
            <div className="menu">
               <ul>
                  <NavLink to="/">
                     <li>Home</li>
                  </NavLink>
                  <NavLink to="/Shop">
                     <li>Shopping</li>
                  </NavLink>
                  <NavLink to="">
                     <li>Car Comparison</li>
                  </NavLink>
                  <NavLink to="/Contact">
                     <li>Contact</li>
                  </NavLink>

               </ul>
            </div>
            <div class=""></div>
         </div>

         <main>
            <Outlet />
         </main>

      </>
   );
};
