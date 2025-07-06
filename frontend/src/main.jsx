import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";

import App from "./App";
import Homescreen from "./pages/Homescreen";
import ProductScreen from "./pages/ProductScreen";
import { store } from "./store";
import { Provider } from "react-redux";
import CartScreen from "./pages/cartScreen"; // ✅ Capitalized
import LoginScreen from "./pages/LoginScreen";
import RegistrationScreen from "./pages/RegistrationScreen";
import ShippingScreen from "./pages/ShippingScreen";
import PrivateRoute from "./components/PrivateRoute";
import PaymentScreen from "./pages/PaymentScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import OrderScreen from "./pages/OrderScreen";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ProfileScreen from "./pages/ProfileScreen";
import AdminRoute from "./components/AdminRoute";
import OrderListScreen from "./pages/AdminScreens/OrderListScreen";
import ProductListScreen from "./pages/AdminScreens/ProductListScreen";
import ProductEditScreen from "./pages/AdminScreens/ProductEditScreen";
import UsersScreenList from "./pages/AdminScreens/UsersScreenList";
import UserEditScreen from "./pages/AdminScreens/UserEditScreen";







const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Homescreen />} />
      <Route path='/search/:keyword' element={<Homescreen />} />
      <Route path='/page/:pageNumber' element={<Homescreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<Homescreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegistrationScreen />} />

      {/* ✅ Protected Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="" element ={<AdminRoute/>}>

      <Route path="admin/orderlist" element={<OrderListScreen />} />
      <Route path="admin/productlist" element={<ProductListScreen />} />
       <Route path="admin/productlist/:pageNumber" element={<ProductListScreen />} />
      <Route path="admin/product/:id/edit" element={<ProductEditScreen />} />
          <Route path="admin/userList" element={<UsersScreenList />} />
         <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />


      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
   
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    
  </StrictMode>
);
