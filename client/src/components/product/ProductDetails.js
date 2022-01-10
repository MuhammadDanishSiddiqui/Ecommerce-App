import React, { useState } from 'react'
import "./ProductDetails.css"
import { useSelector, useDispatch } from "react-redux"
import { getProductDetail, newReview, clearErrors } from "../../config/redux/actions/productAction"
import Carousel from "react-material-ui-carousel"
import { useEffect } from "react"
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import avatar from "../../avatar.png"
import Paper from '@material-ui/core/Paper';
import { addItemsToCart } from "../../config/redux/actions/cartActions"
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import { Rating } from "@material-ui/lab"


const useStyles = makeStyles(theme => ({

    root: {
        padding: "0px 30px",
        marginTop: "80px",
        [theme.breakpoints.down("xs")]: {
            marginTop: "130px",
        }
    },

    carousel_wrapper: {
        width: "400px",
        height: "500px",
        padding: "20px",
    },
    leftSide: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    rightSide: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        height: "500px",
        [theme.breakpoints.down("sm")]: {
            margin: "20px auto",
        }
    },
    rating: {
        borderTop: "1px solid blue",
        borderBottom: "1px solid blue",
        display: "flex",
        alignItems: "center",
        padding: "10px 0"
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
    add_to_cart: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap"
    },
    add_to_cart_btn: {
        padding: "7px 15px",
        marginLeft: "20px",
        backgroundColor: "green",
        fontWeight: 700,
        color: "white",
        border: "1px solid green",
        cursor: "pointer",
        fontSize: "15px",
        borderRadius: "30px",
        "&:hover": {
            backgroundColor: "blue",
        }
    },
    status: {
        borderTop: "1px solid blue",
        borderBottom: "1px solid blue",
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        width: "300px"
    },
    reviewHeading: {
        width: "280px",
        borderBottom: "1px solid blue",
        textAlign: "center",
        padding: "10px",
        margin: "15px auto",
        color: "blue",
        marginBottom: "50px",
        fontSize: "30px"
    },
    avatar: {
        width: "70px",
        height: "70px",
        borderRadius: "50%"
    },
    reviews: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        flexDirection: "column",
        minHeight: "230px",
        [theme.breakpoints.down("md")]: {
            marginBottom: "25px"
        }
    }

}));


function ProductDetails() {
    const [quantity, setQuantity] = useState(1)
    const classes = useStyles();
    const dispatch = useDispatch()
    const { product, loading, error } = useSelector(state => state.productDetail)
    const [open, setOpen] = useState(false)
    const [rating, setRatings] = useState(0)
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { message, error: reviewError } = useSelector(state => state.newReview)

    let { id } = useParams()

    useEffect(() => {
        dispatch(getProductDetail(id))
    }, [])

    useEffect(() => {
        if (error) {
            if (error.error) {
                alert(error.error)
            }
            else {
                alert(error.message)
            }
            dispatch(clearErrors())

        }

    }, [id, error])
    useEffect(() => {
        if (reviewError) {
            alert(reviewError)
            setIsLoading(false)
            dispatch(clearErrors())
        }

        if (message) {
            dispatch(getProductDetail(id))
            alert(message)
            setIsLoading(false)
            dispatch({ type: "NEW_REVIEW_RESET" })
        }
    }, [dispatch, reviewError, message])
    const options = {
        value: product.ratings,
        readOnly: true,
        precision: 0.5
    }

    const submitReviewTogg = () => {
        open ? setOpen(false) : setOpen(true)

    }

    const reviewSubmitHandler = () => {
        const myform = new FormData()
        myform.append("rating", rating)
        myform.append("comment", comment)
        myform.append("productId", id)
        dispatch(newReview(myform))
        setOpen(false)
    }

    return (
        <>
            {loading || isLoading ? <div style={{ width: "100%", height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </div> : <><Grid container className={classes.root} alignItems="center" justifyContent="center">
                <Grid className={classes.leftSide} item sm={6} xs={12}>

                    <Carousel className={classes.carousel_wrapper}>
                        {product.images && product.images[0] && product.images.map((item, i) => {
                            return <img key={i} style={{ width: "100%", height: "420px" }} src={item.url} alt={`${i} Slide`} />
                        })}
                    </Carousel>

                </Grid>
                <Grid className={classes.rightSide} item sm={6} xs={12}>
                    <div style={{ width: "300px" }}>
                        <Typography variant="h5">{product.name}</Typography>
                        <Typography variant="body1">Product Id : {product._id}</Typography>
                        <div className={classes.rating}>
                            <Rating {...options} /><span>({product.numOfReviews} Reviews)</span>
                        </div>
                    </div>
                    <div style={{ margin: "20px 0", width: "300px" }}>
                        <Typography variant="h4">${product.price}</Typography>
                        <div className={classes.add_to_cart}>
                            <div className={classes.plus_minus}><button onClick={() => {
                                if (quantity <= 1)
                                    return
                                setQuantity(quantity - 1)
                            }}>-</button><span>{quantity}</span><button onClick={() => {
                                if (quantity >= product.stock)
                                    return
                                setQuantity(quantity + 1)
                            }}>+</button></div>
                            <button disabled={product.stock < 1 ? true : false} onClick={() => {
                                dispatch(addItemsToCart(id, quantity))
                                alert("Item added to cart.")
                            }} className={classes.add_to_cart_btn}>Add to Cart</button>
                        </div>
                    </div>
                    <div className={classes.status}>
                        <Typography variant="body1">Status : {product.stock < 1 ? "Out of stock" : "In stock"}</Typography>
                    </div>

                    <div style={{ width: "300px" }}>
                        <div style={{ margin: "20px 0" }}>
                            <Typography variant="h5">Description</Typography>
                            <Typography variant="body1">{product.description}</Typography>
                        </div>
                        <button onClick={submitReviewTogg} className={classes.add_to_cart_btn}>Submit Review</button>
                    </div>
                </Grid>
            </Grid>

                    <h1 className={classes.reviewHeading}>Reviews</h1>
                    <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={submitReviewTogg} >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating onChange={(e, val) => setRatings(val)} value={rating} />
                            <textarea className="submitDialogTextArea" cols="30" rows="5" value={comment} onChange={e => setComment(e.target.value)}>

                            </textarea>
                        </DialogContent>
                        <DialogActions><Button color="secondary" onClick={submitReviewTogg}>Cancel</Button>
                            <Button onClick={() => {
                                setIsLoading(true)
                                reviewSubmitHandler()
                            }} color="primary">Submit</Button></DialogActions>
                    </Dialog>


                    <Grid justifyContent="space-around" container style={{ marginBottom: "20px" }}>
                        {product.reviews && product.reviews[0] ? product.reviews.map((review, i) => {
                            const optionsReview = {
                                value: review.rating,
                                readOnly: true,
                                precision: 0.5
                            }
                            return <Grid key={i} item md={3} sm={5} xs={8}>
                                <Paper className={classes.reviews}>
                                    <img className={classes.avatar} src={avatar} alt="avatar" />
                                    <Typography variant="body1">{review.name}</Typography>
                                    <Rating {...optionsReview} />
                                    <Typography style={{ overflow: "auto", maxHeight: "80px" }} variant="body1">{review.comment}</Typography>
                                </Paper>
                            </Grid>
                        }) :
                            <Typography variant="body1">No reviews yet</Typography>
                        }

                    </Grid>

                </>}


        </>
    )
}

export default ProductDetails
