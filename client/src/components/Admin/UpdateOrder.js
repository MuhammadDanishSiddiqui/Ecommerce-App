import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { Typography, CircularProgress, Button } from "@material-ui/core"
import Sidebar from "./Sidebar"
import { getOrderDetails, clearErrors } from "../../config/redux/actions/orderActions"
import AccountTreeIcon from "@material-ui/icons/AccountTree"
import axios from "axios"
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    EachItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            height: "180px"
        }
    }
}))

function UpdateOrder() {
    const classes = useStyles()
    const [status, setStatus] = useState("")
    const { id } = useParams()
    const dispatch = useDispatch()
    const { order, error, loading } = useSelector(state => state.orderDetails)
    const [isLoading, setIsLoading] = useState(false)
    const [updateError, setUpdateError] = useState()

    useEffect(() => {
        dispatch(getOrderDetails(id))
    }, [])


    useEffect(() => {
        if (error) {
            alert(error.error)
            dispatch(clearErrors())
        }
    }, [dispatch, error])

    async function processOrder(e) {

        setUpdateError(null)
        e.preventDefault()
        const myform = new FormData()
        myform.append("status", status)
        try {
            setIsLoading(true)
            const { data } = await axios({
                method: "PATCH",
                url: "/api/admin/order/" + id,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: myform
            })
            setIsLoading(false)
            alert(data.message)
            dispatch(getOrderDetails(id))
        } catch (error) {
            setIsLoading(false)
            setUpdateError(error.response.data)
        }
    }



    return (
        <>
            <div className="extraDashProNew"></div>
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    {
                        loading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "80vh" }}>
                            <CircularProgress />
                        </div> :
                            <>
                                <div style={{ marginTop: "80px" }}></div>
                                <div className="confirmOrderPage">
                                    <div>
                                        <div className="confirmShippingArea">
                                            <Typography variant="h5">Shipping Info</Typography>
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
                                            <Typography variant="h5">Payment</Typography>
                                            <div className="orderDetailsContainerBox">
                                                <div>
                                                    <p className={order.paymentInfo && order.paymentInfo.status === "succeeded" ? "greenColor" : "redColor"}>{order.paymentInfo && order.paymentInfo.status === "succeeded" ? "PAID" : "NOT PAID"}</p>
                                                </div>
                                                <div>
                                                    <p>Amount:</p>
                                                    <span>{order.totalPrice && order.totalPrice}</span>
                                                </div>


                                            </div>
                                            <Typography variant="h5">Order Status</Typography>
                                            <div className="orderDetailsContainerBox">
                                                <div>
                                                    <p className={order.orderStatus && order.orderStatus === "Delievered" ? "greenColor" : "redColor"}>{order.orderStatus && order.orderStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="confirmCartItems">
                                            <Typography variant="h5">Your cart items:</Typography>
                                            <div className="confirmCartItemsContainer">
                                                {
                                                    order.orderItems && order.orderItems.map(item => {
                                                        return <div key={item.product} className={classes.EachItem}>
                                                            <img src={item.image} alt="product" />
                                                            <Link to={`/product${item.product}`}>{item.name}</Link>
                                                            <span>{item.quantity} X {item.price} = {item.quantity * item.price}</span>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: order.orderStatus === "Delievered" ? "none" : "block" }}>
                                        <form className="createProductForm" onSubmit={processOrder}>
                                            <Typography variant="h5">Process Order</Typography>
                                            <div>
                                                <AccountTreeIcon />
                                                <select value={status} onChange={e => setStatus(e.target.value)}>
                                                    <option value="">Choose Category</option>
                                                    {order.orderStatus === "Processing" && <option value="Shipped">Shipped</option>}
                                                    {order.orderStatus === "Shipped" && <option value="Delievered">Delievered</option>}

                                                </select>
                                            </div>
                                            {
                                                updateError && updateError.error ? <small style={{ color: "red" }}>{updateError.error}</small> : updateError && updateError.message && <small style={{ color: "red" }}>{updateError.message}</small>
                                            }

                                            {
                                                isLoading ? <Button style={{ backgroundColor: "white" }} id="createProductButton" type="submit" disabled={isLoading ? true : false || status === "" ? true : false}>{<CircularProgress />}</Button> : <Button id="createProductButton" type="submit" disabled={isLoading ? true : false || status === "" ? true : false}>Process</Button>
                                            }


                                        </form>
                                    </div>

                                </div>
                            </>
                    }
                </div>
            </div>

        </>


    )
}

export default UpdateOrder
