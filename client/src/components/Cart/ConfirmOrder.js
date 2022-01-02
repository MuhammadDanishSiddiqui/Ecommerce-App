import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import "./Shipping.css"
import CheckoutSteps from "./CheckoutSteps"
import { Link, useNavigate } from "react-router-dom"
import { Typography } from "@material-ui/core"
import "./ConfirmOrder.css"
import "./Shipping.css"

function ConfirmOrder() {
    const navigate = useNavigate()
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (item.quantity * item.price)
    }, 0)

    const shippingCharges = subtotal > 1000 ? 0 : 200
    const tax = subtotal * 0.18
    const totalPrice = subtotal + tax + shippingCharges
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`

    function proceedToPayment() {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        }
        sessionStorage.setItem("orderInfo", JSON.stringify(data))
        navigate("/process/payment")
    }

    return (
        <>
            <CheckoutSteps activeStep={1} />
            <div className="confirmOrderPage">
                <div>
                    <div className="confirmShippingArea">
                        <Typography variant="h5">Shipping Info</Typography>
                        <div className="confirmShippingAreaBox">
                            <div>
                                <p>Name:</p>
                                <span>{user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phoneNo}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{address}</span>
                            </div>
                        </div>
                    </div>
                    <div className="confirmCartItems">
                        <Typography variant="h5">Your cart items:</Typography>
                        <div className="confirmCartItemsContainer">
                            {
                                cartItems && cartItems.map(item => {
                                    return <div key={item.product}>
                                        <img src={item.image} alt="product" />
                                        <Link to={`/product${item.product}`}>{item.name}</Link>
                                        <span>{item.quantity} X {item.price} = {item.quantity * item.price}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className="orderSummary">
                        <Typography style={{ marginBottom: "20px" }} variant="h5">Order Summary</Typography>
                        <div>
                            <div style={{ display: "flex", marginBottom: "10px" }}>
                                <p style={{ marginRight: "20px" }}>Subtotal:</p>
                                <span>${subtotal}</span>
                            </div>
                            <div style={{ display: "flex", marginBottom: "10px" }}>
                                <p style={{ marginRight: "20px" }}>Shipping Charges:</p>
                                <span>${shippingCharges}</span>
                            </div>
                            <div style={{ display: "flex", marginBottom: "20px" }}>
                                <p style={{ marginRight: "20px" }}>GST:</p>
                                <span>${tax}</span>
                            </div>
                        </div>
                        <div className="orderSummaryTotal">
                            <p style={{ marginRight: "20px" }}>Total:</p>
                            <span>${totalPrice}</span>
                        </div>
                        <button className="proceed_btn" onClick={proceedToPayment}>Proceed To Payment</button>
                    </div>
                </div>

            </div>

        </>
    )
}

export default ConfirmOrder
