import React from 'react'
import "./Cart.css"
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom"
import Paper from '@material-ui/core/Paper';
import { useSelector, useDispatch } from "react-redux"
import { removeItemsFromCart, addItemsToCart } from "../../config/redux/actions/cartActions"
import { useNavigate } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    extra: {
        marginTop: "90px",
        [theme.breakpoints.down("xs")]: {
            marginTop: "170px",
        }
    },
    card: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: "20px",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
            height: "300px"
        }
    },
    plus_minus: {
        "& > button": {
            padding: "5px 7px",
            fontSize: "15px"
        },
        "& > span": {
            fontSize: "20px",
            border: "1px solid black",
            padding: "4px 10px"
        }
    },
}));

const item = {
    name: "testing",
    image: "https://mobilemall.pk/public_html/images/no_image.png",
    price: 200,
    product: "fake",
    stock: 5,
    quantity: 1
}


function Cart() {
    const navigate = useNavigate()
    const classes = useStyles()
    const { cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch()


    function checkoutHandler() {
        navigate("/shipping")
    }

    function increaseQuantity(id, qty, stock) {
        const newQty = qty + 1
        if (newQty > stock)
            return
        dispatch(addItemsToCart(id, newQty))
    }

    function decreaseQuantity(id, qty) {
        const newQty = qty - 1
        if (newQty < 1)
            return
        dispatch(addItemsToCart(id, newQty))
    }

    return (
        <>
            <div className={classes.extra}>

            </div>

            {
                cartItems.length == 0 ? <Typography variant="h4" style={{ textAlign: "center", marginBottom: "10px" }}>Nothing in Your Cart</Typography> : <>
                    <Typography variant="h4" style={{ textAlign: "center", marginBottom: "10px" }}>Your Cart</Typography>
                    {
                        cartItems.map(item => {
                            return <div className={classes.card}>
                                <Link to={`/product/${item.product}`}>
                                    <img style={{ width: "200px" }} src={item.image} alt="" />
                                </Link>

                                <div>
                                    <Typography variant="body1">Name: {item.name}</Typography>
                                    <Typography variant="body1">Price: <span style={{ color: "blue" }}>${item.price}</span></Typography>
                                    <Typography variant="body1">Sub Total: <span style={{ color: "red" }}>${item.price * item.quantity}</span></Typography>
                                </div>
                                <div className={classes.plus_minus}><button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button><span>{item.quantity}</span><button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button></div>
                                <span onClick={() => dispatch(removeItemsFromCart(item.product))} style={{ color: "red", cursor: "pointer" }}>Remove</span>
                            </div>
                        })
                    }

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "20px", marginBottom: "30px" }}>
                        <Typography variant="h6">   Total : {cartItems.reduce((accum, item) => {
                            return accum + (item.quantity * item.price)
                        }, 0)}</Typography>
                        <button onClick={checkoutHandler} style={{ padding: "10px", backgroundColor: "green", color: "white", outline: "none", border: "1px solid white", cursor: "pointer", fontSize: "15px" }}>Check Out</button>
                    </div>
                </>
            }


        </>
    )
}

export default Cart
