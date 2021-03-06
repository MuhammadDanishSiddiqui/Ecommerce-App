import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import "./MyOrders.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, myOrders } from "../../config/redux/actions/orderActions"
import { CircularProgress } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import LaunchIcon from "@material-ui/icons/Launch"
import { Link } from "react-router-dom"

function MyOrders() {
    const dispatch = useDispatch()
    const { loading, error, orders } = useSelector(state => state.myOrders)
    const { user, isAuth, loading: userLoading } = useSelector(state => state.user)

    useEffect(() => {
        if (error) {
            alert(error)
            dispatch(clearErrors())
        }
        if (isAuth)
            dispatch(myOrders())


    }, [dispatch, error, isAuth])


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
            field: "actions", headerName: "Actions", flex: 0.3, minWidth: 150, type: "number", sortable: false,
            renderCell: (params) => {
                return <Link to={`/order/${params.getValue(params.id, "id")}`}><LaunchIcon /></Link>
            }
        }
    ]
    const rows = []

    orders && orders.forEach((item) => {
        rows.push({
            itemsQty: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice
        })
    })


    return (
        <>
            {
                loading || userLoading ?
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
                        <CircularProgress />
                    </div>
                    :
                    <>
                        <div className="extra"></div>
                        <div className="myOrderPage">
                            {
                                orders && orders[0] ?
                                    <>
                                        <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className="myOrdersTable" autoHeight />
                                        <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
                                    </> : <h3 style={{ textAlign: "center" }}>No Order Found</h3>
                            }

                        </div>
                    </>
            }

        </>
    )
}

export default MyOrders
