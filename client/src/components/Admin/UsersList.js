import React, { useEffect, useState } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import "./ProductList.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getAllUsers } from "../../config/redux/actions/userActions"
import { Link } from "react-router-dom"
import { Button } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Sidebar from "./Sidebar"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function UserList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { error, users } = useSelector(state => state.allUsers)
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
        dispatch(getAllUsers())

    }, [dispatch, alert, error])
    const columns = [
        {
            field: "id", headerName: "User ID", minWidth: 180, flex: 0.8
        },
        {
            field: "email", headerName: "Email", minWidth: 200, flex: 1
        },
        {
            field: "name", headerName: "Name", minWidth: 150, flex: 0.5
        },
        {
            field: "role", headerName: "Role", type: "number", minWidth: 150, flex: 0.3,
            cellClassName: params => {
                return params.getValue(params.id, "role") == "admin" ? "greenColor" : "redColor"
            }
        },
        {
            field: "actions", headerName: "Actions", minWidth: 150, flex: 0.3, type: "number", sortable: false,
            renderCell: (params) => {
                return <>
                    <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>
                    <Button disabled={isLoading ? true : false} onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}><DeleteIcon /></Button>
                </>
            }
        }
    ]
    const rows = []
    users && users.forEach(item => {
        rows.push({
            id: item._id,
            role: item.role,
            email: item.email,
            name: item.name
        })
    })

    const deleteUserHandler = async (id) => {
        try {
            setIsLoading(true)
            const { data } = await axios({
                method: "DELETE",
                url: "/api/admin/user/" + id,
            })
            setIsLoading(false)
            alert(data.message)
            dispatch(getAllUsers())

        } catch (error) {
            console.log(error)
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
                    <h1 id="productListHeading">All Users</h1>
                    <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className="productListTable" autoHeight />
                </div>
            </div>
        </>
    )
}

export default UserList
