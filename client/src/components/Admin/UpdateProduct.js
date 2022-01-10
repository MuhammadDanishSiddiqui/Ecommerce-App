import React, { useState, useEffect } from 'react'
import "./newProduct.css"
import { useSelector, useDispatch } from "react-redux"
import { getProductDetail } from "../../config/redux/actions/productAction"
import { Button } from "@material-ui/core"
import AccountTreeIcon from "@material-ui/icons/AccountTree"
import DescriptionIcon from "@material-ui/icons/Description"
import StorageIcon from "@material-ui/icons/Storage"
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"
import Sidebar from "./Sidebar"
import { useNavigate } from "react-router-dom"
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from "react-router-dom"
import axios from "axios"

function UpdateProduct() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { product } = useSelector(state => state.productDetail)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState(0)
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [updateError, setUpdateError] = useState()

    const categories = ["mobile", "laptop", "furniture", "footware", "camera"]

    useEffect(() => {
        dispatch(getProductDetail(id))
    }, [])

    useEffect(() => {
        if (product) {
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price)
            setCategory(product.category)
            setStock(product.stock)
            setOldImages(product.images)
        }
    }, [product])

    const updateProductSubmitHandler = async (e) => {
        setUpdateError(null)
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

        try {
            setIsLoading(true)
            const { data } = await axios({
                method: "PATCH",
                url: "/api/admin/product/" + id,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: myform
            })
            setIsLoading(false)
            alert(data.message)
            navigate("/admin/products")
        } catch (error) {
            setIsLoading(false)
            setUpdateError(error.response.data)
        }

    }

    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files)
        setImages([])
        setImagesPreview([])
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
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
                    <form className="createProductForm" encType="multipart/form-data" onSubmit={updateProductSubmitHandler}>
                        <h1>Update Product</h1>
                        <div>
                            <SpellcheckIcon />
                            <input type="text" placeholder="Product Name" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        {
                            updateError && updateError.errors && updateError.errors.name && <span style={{ color: "red" }}>{updateError.errors.name.message}</span>
                        }
                        <div>
                            <AttachMoneyIcon />
                            <input type="number" placeholder="Price" required value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                        {
                            updateError && updateError.errors && updateError.errors.price && <span style={{ color: "red" }}>{updateError.errors.price.message}</span>
                        }
                        <div>
                            <DescriptionIcon />
                            <textarea type="text" placeholder="Product Description" required value={description} onChange={e => setDescription(e.target.value)} cols={"30"} rows={"1"} >
                            </textarea>
                        </div>
                        {
                            updateError && updateError.errors && updateError.errors.description && <span style={{ color: "red" }}>{updateError.errors.description.message}</span>
                        }
                        <div>
                            <AccountTreeIcon />
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="">Choose Category</option>
                                {categories.map(cat => {
                                    return <option key={cat} value={cat}>{cat}</option>
                                })}
                            </select>
                        </div>
                        {
                            updateError && updateError.errors && updateError.errors.category && <span style={{ color: "red" }}>{updateError.errors.category.message}</span>
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
                            updateError && updateError.errors && updateError.errors.images && <span style={{ color: "red" }}>{updateError.errors.images.message}</span>
                        }

                        <div className="createProductFormImage">
                            {oldImages && oldImages.map((image, index) => {
                                return <img src={image.url} key={index} alt="old Images" />
                            })}
                        </div>

                        <div className="createProductFormImage">
                            {imagesPreview.map((image, index) => {
                                return <img src={image} key={index} alt="Images" />
                            })}
                        </div>
                        {
                            updateError && updateError.error && <span style={{ color: "red" }}>{updateError.error}</span>
                        }

                        {
                            isLoading ? <Button style={{ backgroundColor: "white" }} id="createProductButton" type="submit" disabled={isLoading ? true : false}>{<CircularProgress />}</Button> : <Button id="createProductButton" type="submit" disabled={isLoading ? true : false}>Update</Button>
                        }


                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateProduct
