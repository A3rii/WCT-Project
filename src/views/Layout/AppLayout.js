import Header from "./../../components/Header/Header.js"
import Navbar from "./../../components/Navbar/Navbar.js"
import Footer from "./../../components/Footer/Footer.js"

const AppLayout = ({ children }) => {
   return (
      <>
         <Header />

         {children}
         <Footer />
      </>
   );
}
export default AppLayout;