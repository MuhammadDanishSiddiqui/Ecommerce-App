import React, { useEffect } from 'react'
import "./OrderDetails.css"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Typography, CircularProgress } from "@material-ui/core"
import { getOrderDetails, clearErrors } from "../../config/redux/actions/orderActions"
import { useParams } from "react-router-dom"

function OrderDetails() {
    const { id } = useParams()
    const { order, error, loading } = useSelector(state => state.orderDetails)
    const { isAuth } = useSelector(state => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        if (error) {
            alert(error.error)
            dispatch(clearErrors())
        }
        if (isAuth)
            dispatch(getOrderDetails(id))
    }, [dispatch, error, isAuth, id])
    return (
        <>
            {
                loading ?
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
                        <CircularProgress />
                    </div> : <>
                        <div className="extra"></div>
                        <div className="orderDetailsPage">
                            <div className="orderDetailsContainer">
                                <Typography component="h1">Order # {order && order._id}</Typography>
                                <Typography>Shipping Info</Typography>
                                <div className="orderDetailsContainerBox">
                                    <div>
                                        <p>Name:</p>
                                        <span>{order.user && order.user.name}</span>
                                    </div>
                                    <div>
                                        <p>Phone:</p>
                                        <span>{order.shippingInfo && order.shippingInfo.phone}</span>
                                    </div>
                                    <div>
                                        <p>Address:</p>
                                        <span>{order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                                    </div>
                                </div>
                                <Typography>Payment</Typography>
                                <div className="orderDetailsContainerBox">
                                    <div>
                                        <p className={order.paymentInfo && order.paymentInfo.status === "succeeded" ? "greenColor" : "redColor"}>{order.paymentInfo && order.paymentInfo.status === "succeeded" ? "PAID" : "NOT PAID"}</p>
                                    </div>
                                    <div>
                                        <p>Amount:</p>
                                        <span>{order.totalPrice && order.totalPrice}</span>
                                    </div>


                                </div>
                                <Typography>Order Status</Typography>
                                <div className="orderDetailsContainerBox">
                                    <div>
                                        <p className={order.orderStatus && order.orderStatus === "Delievered" ? "greenColor" : "redColor"}>{order.orderStatus && order.orderStatus}</p>
                                    </div>
                                </div>
                            </div>


                            <div className="orderDetailsCartItems">
                                <Typography>Order Items:</Typography>
                                <div className="orderDetailsCartItemsContainer">
                                    {order.orderItems && order.orderItems.map(item => {
                                        return <div key={item.product}>
                                            <img src={item.image} alt={item.name} />
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            <span>{item.quantity} X {item.price} = ${item.price * item.quantity}</span>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                    </>
            }
        </>
    )
}

export default OrderDetails
