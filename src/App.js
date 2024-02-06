import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/Pages/HomePage/HomePage";
import FormProduct from "./components/AddProduct/FormPostingProduct";
import ShopPage from "./views/Pages/ShopPage/ShopPage";
import SignUpForm from "./views/Pages/SignUpPage/SignUpPage";
import LoginPage from "./views/Pages/LoginPage/LoginPage";
import ProductSeller from "./components/CarCard/ProductSeller/ProductSeller";
import ContactPage from "./views/Pages/ContactPage/ContactPage";
import AppMenu from "./components/SideMenu/AppMenu";
import AddToFavorite from "./components/AddToFavorite/AddToFavorite";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add-product" element={<FormProduct />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/SignUp" element={<SignUpForm />} />
        <Route path="/SignIn" element={<LoginPage />} />
        <Route path="/product-seller" element={<ProductSeller />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/app-menu" element={<AppMenu />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/favorite" element={<AddToFavorite />} />
      </Routes>
    </Router>
  );
}
