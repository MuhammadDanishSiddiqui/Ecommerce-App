import './App.css';
import { useEffect, useState } from "react"
import Home from "./components/Home/Home"
import ProductDetails from "./components/product/ProductDetails"
import Products from "./components/Products/Products"
import Search from "./components/Search/Search"
import Profile from "./components/User/Profile"
import Cart from "./components/Cart/Cart"
import Navbar from "./components/Navbar"
import ForgotPassword from "./components/User/ForgotPassword"
import ResetPassword from "./components/User/ResetPassword"
import Register from "./components/User/Register"
import Login from "./components/User/Login"
import { getUserProfile } from "./config/redux/actions/userActions"
import { useSelector, useDispatch } from "react-redux"
import ChangePassword from "./components/User/ChangePassword"
import Shipping from "./components/Cart/Shipping.js"
import ConfirmOrder from "./components/Cart/ConfirmOrder.js"
import Payment from "./components/Cart/Payment.js"
import OrderSuccess from "./components/Cart/OrderSuccess.js"
import MyOrders from "./components/Order/MyOrders.js"
import OrderDetails from "./components/Order/OrderDetails.js"
import Dashboard from "./components/Admin/Dashboard.js"
import ProductList from "./components/Admin/ProductList.js"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"


import {

  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation

} from "react-router-dom";
import axios from 'axios';
import ProtectedRoute from "./components/ProctedRoute"
import NewProduct from './components/Admin/NewProduct';






function App() {
  const [stripeApiKey, setStripeApiKEy] = useState("")
  let location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuth, loading } = useSelector(state => state.user)

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/stripeapikey")
    setStripeApiKEy(data.stripeApiKey)
  }

  useEffect(() => {
    localStorage.setItem("currentPath", location.pathname)
  }, [location])

  useEffect(() => {
    // if (!localStorage.getItem("token")) {
    //   return navigate(localStorage.getItem("currentPath"))
    // }

    if (localStorage.getItem("token")) {
      axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token")


      dispatch(getUserProfile())
      getStripeApiKey()



      // if (isAuth) {
      //   console.log("App chala", localStorage.getItem("currentPath"))
      //   navigate(localStorage.getItem("currentPath") == "/login" ? "/products" : localStorage.getItem("currentPath"))
      // }
    }

  }, [dispatch])



  return (

    <>
      <Navbar />
      <Routes >
        <Route exact path="/" element={<Home />} />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="/cart" element={<Cart />} />
        {/* <Route exact path="/profile" element={<Profile />} /> */}


        <Route
          path="/profile"
          element={
            <ProtectedRoute redirectTo="/login">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute redirectTo="/login">
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute redirectTo="/login">
              <Shipping />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/confirm"
          element={
            <ProtectedRoute redirectTo="/login">
              <ConfirmOrder />
            </ProtectedRoute>
          }
        />


        <Route
          path="/success"
          element={
            <ProtectedRoute redirectTo="/login">
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute redirectTo="/login">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <ProtectedRoute redirectTo="/login">
              <OrderDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute redirectTo="/login" isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute redirectTo="/login" isAdmin={true}>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/product"
          element={
            <ProtectedRoute redirectTo="/login" isAdmin={true}>
              <NewProduct />
            </ProtectedRoute>
          }
        />



        {
          stripeApiKey && <Route
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute redirectTo="/login">
                  <Payment />
                </ProtectedRoute>
              </Elements>

            }
          />
        }



        <Route exact path="/register" element={<Register isLoading={loading} />} />
        <Route exact path="/login" element={<Login isLoading={loading} />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
      </Routes >
    </>
  );
}

export default App;
