import React, { useEffect, useState } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import "./ProductList.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getAllOrders } from "../../config/redux/actions/orderActions"
import { Link } from "react-router-dom"
import { Button } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Sidebar from "./Sidebar"
import axios from "axios"

function OrderList() {
    const dispatch = useDispatch()
    const { error, orders } = useSelector(state => state.allOrders)
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
        dispatch(getAllOrders())

    }, [dispatch, error])
    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
        {
            field: "status", headerName: "Status", minWidth: 150, flex: 0.5, cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delievered" ? "greenColor" : "redColor"
            }
        },
        {
            field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.3
        },
        {
            field: "amount", headerName: "Amount", type: "number", minWidth: 270, flex: 0.5
        },
        {
            field: "actions", headerName: "Actions", minWidth: 150, flex: 0.3, type: "number", sortable: false,
            renderCell: (params) => {
                return <>
                    <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>
                    <Button disabled={isLoading ? true : false} onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}><DeleteIcon /></Button>
                </>
            }
        }
    ]
    const rows = []
    orders && orders.forEach(item => {
        rows.push({
            id: item._id,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice,
            status: item.orderStatus
        })
    })

    const deleteOrderHandler = async (id) => {
        try {
            setIsLoading(true)
            const { data } = await axios({
                method: "DELETE",
                url: "/api/admin/order/" + id,
            })
            setIsLoading(false)
            alert(data.message)
            dispatch(getAllOrders())

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
                        orders && orders[0] ? <>
                            <h1 id="productListHeading">All Orders</h1>
                            <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className="productListTable" autoHeight /></> : <h3 style={{
                                margin: "90px",
                                textAlign: "center"
                            }}>No Order Found</h3>
                    }
                </div>
            </div>
        </>
    )
}

export default OrderList
