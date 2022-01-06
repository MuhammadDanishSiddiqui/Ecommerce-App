import React, { useState, useEffect } from 'react'
import "./newProduct.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, createProduct } from "../../config/redux/actions/productAction"
import { Button } from "@material-ui/core"
import AccountTreeIcon from "@material-ui/icons/AccountTree"
import DescriptionIcon from "@material-ui/icons/Description"
import StorageIcon from "@material-ui/icons/Storage"
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"
import Sidebar from "./Sidebar"
import { useNavigate } from "react-router-dom"
import CircularProgress from '@material-ui/core/CircularProgress';


function NewProduct() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error, message } = useSelector(state => state.newProduct)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState(0)
    const [images, setImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])

    const categories = ["mobile", "laptop", "furniture", "footware", "camera"]

    useEffect(() => {
        if (error) {
            dispatch(clearErrors())
        }
        if (message) {
            alert(message)
            dispatch({ type: "NEW_PRODUCT_RESET" })
            navigate("/admin/dashboard")
        }
    }, [dispatch, alert, message, navigate])

    const createProductSubmitHandler = (e) => {
        e.preventDefault()
        const myform = new FormData()
        myform.append("name", name)
        myform.append("price", price)
        myform.append("description", description)
        myform.append("category", category)
        myform.append("stock", stock)

        images.forEach(image => {
            myform.append("images", image)
        })
        dispatch(createProduct(myform))
    }

    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files)
        setImages([])
        setImagesPreview([])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState == 2) {
                    setImagesPreview(old => {
                        return [...old, reader.result]
                    })
                    setImages(old => {
                        return [...old, reader.result]
                    })
                }
            }

            reader.readAsDataURL(file)
        })
    }


    return (
        <>
            <div className="extraDashProNew"></div>
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form className="createProductForm" encType="multipart/form-data" onSubmit={createProductSubmitHandler}>
                        <h1>Create Product</h1>
                        <div>
                            <SpellcheckIcon />
                            <input type="text" placeholder="Product Name" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        {
                            error ?.errors ?.name && <span style={{ color: "red" }}>{error ?.errors ?.name.message}</span>
                        }
                        <div>
                            <AttachMoneyIcon />
                            <input type="number" placeholder="Price" required value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                        {
                            error ?.errors ?.price && <span style={{ color: "red" }}>{error ?.errors ?.price.message}</span>
                        }
                        <div>
                            <DescriptionIcon />
                            <textarea type="text" placeholder="Product Description" required value={description} onChange={e => setDescription(e.target.value)} cols={"30"} rows={"1"} >
                            </textarea>
                        </div>
                        {
                            error ?.errors ?.description && <span style={{ color: "red" }}>{error ?.errors ?.description.message}</span>
                        }
                        <div>
                            <AccountTreeIcon />
                            <select onChange={e => setCategory(e.target.value)}>
                                <option value="">Choose Category</option>
                                {categories.map(cat => {
                                    return <option key={cat} value={cat}>{cat}</option>
                                })}
                            </select>
                        </div>
                        {
                            error ?.errors ?.category && <span style={{ color: "red" }}>{error ?.errors ?.category.message}</span>
                        }
                        <div>
                            <StorageIcon />
                            <input type="number" placeholder="Stock" required value={stock} onChange={e => setStock(e.target.value)} />
                        </div>

                        <div className="createProductFormFile">
                            <StorageIcon />
                            <input type="file" name="avatar" required accept="image/*" multiple onChange={createProductImagesChange} />
                        </div>
                        {
                            error ?.errors ?.images && <span style={{ color: "red" }}>{error ?.errors ?.images.message}</span>
                        }

                        <div className="createProductFormImage">
                            {imagesPreview.map((image, index) => {
                                return <img src={image} key={index} alt="Images" />
                            })}
                        </div>
                        {
                            error ?.error && <span style={{ color: "red" }}>{error ?.error}</span>
                        }

                        {
                            loading ? <Button style={{ backgroundColor: "white" }} id="createProductButton" type="submit" disabled={loading ? true : false}>{<CircularProgress />}</Button> : <Button id="createProductButton" type="submit" disabled={loading ? true : false}>Create</Button>
                        }


                    </form>
                </div>
            </div>
        </>
    )
}

export default NewProduct
