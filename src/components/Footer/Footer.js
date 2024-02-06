import "./FooterStyle.css"
import "./../../App.css"
export default function Footer() {
   return (
      <>
         <div className="footer">
            <div className="container footer-main">
               <div className="company-name">
                  <h1>Car <span id="color-text">Dealership</span></h1>
                  <span>Hot-line: (+885) 023-880-880</span>
                  <span>Email: cardealership_12@gmail.com</span>
                  <span>Address: St 302, Sankat Psar Jas, Phnom Penh</span>
               </div>
               <div className="about">
                  <h1>About</h1>
                  <span>Our Story</span>
                  <span>Our Team</span>
                  <span>Career</span>
               </div>
               <div className="resource">
                  <h1>Resources</h1>
                  <span>Blog</span>
                  <span>Newsletter</span>
                  <span>Privacy Policy</span>
               </div>
               <div className="follow">
                  <h1>Follow Us</h1>
                  <div className="footer-icon">
                     <i className="fa-brands fa-facebook"></i>
                     <i className="fa-brands fa-instagram"></i>
                     <i className="fa-brands fa-telegram"></i>
                     <i className="fa-brands fa-twitter"></i>
                  </div>
               </div>
            </div>

            <hr id="footer-line" />

            <div className="container footer-end">
               <div className="copyright">
                  <span>© All Rights Reserved by Car <span id="color-text">DealerShip</span> </span>
               </div>
               <div className="feedback">
                  <input type="text" id="feedback-input" placeholder="feedback..." />
                  <button type="submit" className="btn btn-dark" id="submit-feedback">
                     <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
               </div>

            </div>
         </div>
      </>
   );
}