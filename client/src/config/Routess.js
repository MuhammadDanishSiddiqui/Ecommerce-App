import React from 'react'
import { useEffect, useState } from "react"
import Home from "../components/Home/Home"
import ProductDetails from "../components/product/ProductDetails"
import Products from "../components/Products/Products"
import Search from "../components/Search/Search"
import Profile from "../components/User/Profile"
import Cart from "../components/Cart/Cart"
import ForgotPassword from "../components/User/ForgotPassword"
import ResetPassword from "../components/User/ResetPassword"
import Register from "../components/User/Register"
import Login from "../components/User/Login"
import ChangePassword from "../components/User/ChangePassword"
import Shipping from "../components/Cart/Shipping.js"
import ConfirmOrder from "../components/Cart/ConfirmOrder.js"
import Payment from "../components/Cart/Payment.js"
import OrderSuccess from "../components/Cart/OrderSuccess.js"
import MyOrders from "../components/Order/MyOrders.js"
import OrderDetails from "../components/Order/OrderDetails.js"
import Dashboard from "../components/Admin/Dashboard.js"
import ProductList from "../components/Admin/ProductList.js"
import OrderList from "../components/Admin/OrderList.js"
import UpdateOrder from "../components/Admin/UpdateOrder.js"
import UsersList from "../components/Admin/UsersList.js"
import UpdateUser from "../components/Admin/UpdateUser.js"
import NotFound from "../components/NotFound/NotFound.js"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import ProtectedRoute from "../components/ProctedRoute"
import NewProduct from '../components/Admin/NewProduct';
import UpdateProduct from "../components/Admin/UpdateProduct.js"
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"
import axios from 'axios';

function Routess() {
    const [stripeApiKey, setStripeApiKEy] = useState("")
    const { isAuth, loading } = useSelector(state => state.user)
    let location = useLocation();

    async function getStripeApiKey() {
        const { data } = await axios.get("/api/stripeapikey")
        setStripeApiKEy(data.stripeApiKey)
    }

    useEffect(() => {
        localStorage.setItem("currentPath", location.pathname)
    }, [location])

    useEffect(() => {
        if (isAuth)
            getStripeApiKey()
    }, [isAuth])



    return (
        <Routes >
            <Route exact path="/" element={<Home />} />
            <Route exact path="/password/forgot" element={<ForgotPassword />} />
            <Route exact path="/password/reset/:token" element={<ResetPassword />} />
            <Route exact path="/register" element={<Register isLoading={loading} />} />
            <Route exact path="/login" element={<Login isLoading={loading} />} />
            <Route exact path="/product/:id" element={<ProductDetails />} />
            <Route exact path="/products" element={<Products />} />
            <Route exact path="/products/:keyword" element={<Products />} />
            <Route exact path="/search" element={<Search />} />

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
                path="/cart"
                element={
                    <ProtectedRoute redirectTo="/login">
                        <Cart />
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

            <Route
                path="/admin/product/:id"
                element={
                    <ProtectedRoute redirectTo="/login" isAdmin={true}>
                        <UpdateProduct />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/orders"
                element={
                    <ProtectedRoute redirectTo="/login" isAdmin={true}>
                        <OrderList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/order/:id"
                element={
                    <ProtectedRoute redirectTo="/login" isAdmin={true}>
                        <UpdateOrder />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/user/:id"
                element={
                    <ProtectedRoute redirectTo="/login" isAdmin={true}>
                        <UpdateUser />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute redirectTo="/login" isAdmin={true}>
                        <UsersList />
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

            <Route path="*" element={<NotFound />} />

        </Routes >
    )
}

export default Routess
