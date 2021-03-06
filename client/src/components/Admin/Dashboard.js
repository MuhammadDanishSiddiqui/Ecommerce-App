import React, { useEffect } from 'react'
import Sidebar from "./Sidebar"
import "./Dashboard.css"
import { clearErrors, getAdminProducts } from "../../config/redux/actions/productAction"
import { Link } from "react-router-dom"
import { Line, Doughnut } from "react-chartjs-2"
import Chart from 'chart.js/auto'
import { useSelector, useDispatch } from "react-redux"
import { getAllOrders } from "../../config/redux/actions/orderActions"
import { getAllUsers } from "../../config/redux/actions/userActions"

function Dashboard() {
    const dispatch = useDispatch()
    const { error, products } = useSelector(state => state.adminProducts)
    const { orders } = useSelector(state => state.allOrders)
    const { users } = useSelector(state => state.allUsers)

    useEffect(() => {
        dispatch(getAdminProducts())
        dispatch(getAllOrders())
        dispatch(getAllUsers())
    }, [])

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
    }, [dispatch, error])

    let outOfStock = 0
    products && products.forEach(item => {
        if (item.stock === 0)
            outOfStock += 1
    })

    let totalAmount = 0
    orders && orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "Total Amount",
                backgroundColor: ["blue"],
                hoverBackgroundColor: ["rgb(197,72,40)"],
                data: [0, totalAmount]
            },
        ],
    }

    const doughnutState = {
        labels: ["Out of stock", "In Stock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products.length - outOfStock]
            }
        ]
    }
    return (
        <>
            <div className="extraDash"></div>
            <div className="dashboard">
                <Sidebar />
                <div className="dashboardContainer">
                    <h1>Dashboard</h1>
                    <div className="dashboardSummary">
                        <div>
                            <p>Total Amount <br /> ${totalAmount}</p>
                        </div>
                        <div className="dashboardSummaryBox2">
                            <Link to="/admin/products">
                                <p>Product</p>
                                <p>{products && products.length}</p>
                            </Link>
                            <Link to="/admin/orders">
                                <p>Orders</p>
                                <p>{orders && orders.length}</p>
                            </Link>
                            <Link to="/admin/users">
                                <p>Users</p>
                                <p>{users && users.length}</p>
                            </Link>
                        </div>
                    </div>
                    <div className="lineChart">
                        <Line data={lineState} />
                    </div>
                    <div className="doughnutChart">
                        <Doughnut data={doughnutState} />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Dashboard
