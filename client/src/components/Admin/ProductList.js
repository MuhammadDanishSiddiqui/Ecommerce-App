import React, { useEffect, useState } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import "./ProductList.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getAdminProducts } from "../../config/redux/actions/productAction"
import { Link } from "react-router-dom"
import { Button } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Sidebar from "./Sidebar"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function ProductList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { error, products } = useSelector(state => state.adminProducts)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (error) {
            if (error.error) {
                alert(error.error)
                dispatch(clearErrors())
            }
            else {
                alert(error.message)
                dispatch(clearErrors())
            }

        }
        dispatch(getAdminProducts())

    }, [dispatch, alert, error])
    const columns = [
        {
            field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5
        },
        {
            field: "name", headerName: "Name", minWidth: 350, flex: 1
        },
        {
            field: "stock", headerName: "Stock", type: "number", minWidth: 150, flex: 0.3
        },
        {
            field: "price", headerName: "Price", type: "number", minWidth: 270, flex: 0.5
        },
        {
            field: "actions", headerName: "Actions", minWidth: 150, flex: 0.3, type: "number", sortable: false,
            renderCell: (params) => {
                return <>
                    <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>
                    <Button disabled={isLoading ? true : false} onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}><DeleteIcon /></Button>
                </>
            }
        }
    ]
    const rows = []
    products && products.forEach(item => {
        rows.push({
            id: item._id,
            stock: item.stock,
            price: item.price,
            name: item.name
        })
    })

    const deleteProductHandler = async (id) => {
        try {
            setIsLoading(true)
            const { data } = await axios({
                method: "DELETE",
                url: "/api/admin/product/" + id,
            })
            setIsLoading(false)
            alert(data.message)
            navigate("/admin/dashboard")

        } catch (error) {
            setIsLoading(false)
            if (error.error) {
                alert(error.error)
            }
            else {
                alert(error.message)
            }
        }

    }
    return (
        <>
            <div className="extraDashPro"></div>
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    {
                        products && products[0] ? <>
                            <h1 id="productListHeading">All Products</h1>
                            <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className="productListTable" autoHeight /></> : <h3 style={{
                                margin: "90px",
                                textAlign: "center"
                            }}>No Product Found</h3>
                    }
                </div>
            </div>
        </>
    )
}

export default ProductList
