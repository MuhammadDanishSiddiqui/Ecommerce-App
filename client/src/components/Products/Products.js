import React, { useState } from 'react'
import Product from "../Home/Product"
import Grid from '@material-ui/core/Grid';
import { getProducts } from "../../config/redux/actions/productAction"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import "./Products.css"
import { useParams } from "react-router-dom"
import Pagination from "react-js-pagination"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from "@material-ui/lab"

const useStyles = makeStyles(theme => ({
    test: {
        "&.MuiSlider-root": {
            width: "100px"
        }
    }
}))

function Products() {
    const dispatch = useDispatch()
    const classes = useStyles();
    const { keyword } = useParams()
    const [currentPage, setCurrentPage] = useState()
    const [price, setPrice] = useState([0, 50000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)

    const { products, loading, error, resultPerPage, filteredProductsCount } = useSelector(state => state.products)
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                position: "top-center"
            })
        }
        dispatch(getProducts(keyword, currentPage, price, category, ratings))
    }, [dispatch, error, keyword, currentPage, price, category, ratings])

    let count = filteredProductsCount
    const options = {
        value: ratings,
        precision: 0.5
    }

    return (
        <>
            <h3 id="products">Products</h3>
            <div className="filterBox">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography style={{ marginRight: "10px" }}>Price</Typography>
                    <Slider className={classes.test}
                        value={price}
                        onChange={(e, newvalue) => setPrice(newvalue)}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={50000}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography>Category </Typography>
                    <select style={{ marginLeft: "10px" }} value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">All</option>
                        <option value="mobile">Mobile</option>
                        <option value="laptop">Laptop</option>
                        <option value="furniture">Furniture</option>
                        <option value="footware">Footware</option>
                        <option value="camera">Camera</option>
                    </select>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography style={{ marginRight: "10px" }}>Ratings</Typography>
                    <Rating {...options} onChange={e => setRatings(Number(e.target.value))} />
                </div>

            </div>
            {loading ? <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress />
            </div> : <Grid container justifyContent="center" style={{ padding: "20px" }}>
                    {products && products[0] ? products.map(product => {
                        return <Product key={product._id} product={product} />
                    }) : <h3>No Product found</h3>}
                </Grid>}
            {resultPerPage < count && <div className={"paginationBox"}>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={count}
                    onChange={e => setCurrentPage(e)}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                />
            </div>}
            <ToastContainer />
        </>

    )
}

export default Products
