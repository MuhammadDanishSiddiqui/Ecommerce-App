import React, { useEffect } from 'react'
import Sidebar from "./Sidebar"
import "./Dashboard.css"
import { clearErrors, getAdminProducts } from "../../config/redux/actions/productAction"
import { Typography } from '@material-ui/core'
import { Link } from "react-router-dom"
import { Line, Doughnut } from "react-chartjs-2"
import Chart from 'chart.js/auto'
import { useSelector, useDispatch } from "react-redux"

function Dashboard() {
    const dispatch = useDispatch()
    const { error, products } = useSelector(state => state.adminProducts)

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

    let outOfStock = 0
    products && products.forEach(item => {
        if (item.stock == 0)
            outOfStock += 1
    })

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "Total Amount",
                backgroundColor: ["blue"],
                hoverBackgroundColor: ["rgb(197,72,40)"],
                data: [0, 4000]
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
                            <p>Total Amount <br /> $20000</p>
                        </div>
                        <div className="dashboardSummaryBox2">
                            <Link to="/admin/products">
                                <p>Product</p>
                                <p>{products && products.length}</p>
                            </Link>
                            <Link to="/admin/orders">
                                <p>Orders</p>
                                <p>4</p>
                            </Link>
                            <Link to="/admin/users">
                                <p>Users</p>
                                <p>2</p>
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
