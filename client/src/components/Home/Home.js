import React from 'react'
import "./Home.css"
import { AiOutlineArrowDown } from 'react-icons/ai';
import Product from "./Product"
import Grid from '@material-ui/core/Grid';
import { getProducts, clearErrors } from "../../config/redux/actions/productAction"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';

function Home() {
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector(state => state.products)
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                position: "top-center"
            })
            dispatch(clearErrors())
        }
        dispatch(getProducts())
    }, [dispatch, error])

    return (
        <>
            <div id="banner">
                <h3 className="welcome">Welcome To Ecommerce</h3>
                <h1 className="amaze">Find Amazing Products Below</h1>
                <a href="#products">
                    <button><span>Scroll</span> <AiOutlineArrowDown /></button>
                </a>
            </div>
            <h3 id="products">Featured Products</h3>
            {loading ? <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress />
            </div> : <Grid container justifyContent="center" style={{ padding: "20px" }}>
                    {products && products[0] ? products.map(product => {
                        return <Product key={product._id} product={product} />
                    }) : <h4>No Product Found</h4>}
                </Grid>}
            <ToastContainer />
        </>
    )
}

export default Home
