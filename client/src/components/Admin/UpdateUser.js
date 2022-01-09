import React, { useState, useEffect } from 'react'
import "./newProduct.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, createProduct } from "../../config/redux/actions/productAction"
import { Button } from "@material-ui/core"
import Sidebar from "./Sidebar"
import { useNavigate } from "react-router-dom"
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from "react-router-dom"
import { getUserDetail } from "../../config/redux/actions/userActions"
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import PersonIcon from "@material-ui/icons/Person"
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser"
import axios from "axios"


function UpdateUser() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error, user } = useSelector(state => state.userDetail)
    const [name, setName] = useState("")
    const [email, setEmail] = useState(0)
    const [role, setRole] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [updateError, setUpdateError] = useState()

    useEffect(() => {
        dispatch(getUserDetail(id))
        if (error) {
            if (error.error) {
                alert(error.error)
            }
            else {
                alert(error.message)
            }
            dispatch(clearErrors())
        }

    }, [dispatch, alert])

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }
    }, [user])

    const updateUserSubmitHandler = async (e) => {
        e.preventDefault()
        const myform = new FormData()
        myform.append("name", name)
        myform.append("email", email)
        myform.append("role", role)

        try {
            setIsLoading(true)
            const { data } = await axios({
                method: "PATCH",
                url: "/api/admin/user/" + id,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: myform
            })
            setIsLoading(false)
            alert(data.message)
            navigate("/admin/users")
        } catch (error) {
            setIsLoading(false)
            setUpdateError(error.response.data)
        }

    }

    return (
        <>
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form className="createProductForm" encType="multipart/form-data" onSubmit={updateUserSubmitHandler}>
                        <h1>Update User</h1>
                        <div>
                            <PersonIcon />
                            <input type="text" placeholder="Name" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        {
                            updateError ?.errors ?.name && <span style={{ color: "red" }}>{updateError ?.errors ?.name.message}</span>
                        }
                        <div>
                            <MailOutlineIcon />
                            <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        {
                            updateError ?.errors ?.email && <span style={{ color: "red" }}>{updateError ?.errors ?.email.message}</span>
                        }

                        <div>
                            <VerifiedUserIcon />
                            <select value={role} onChange={e => setRole(e.target.value)}>
                                <option value="">Choose Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>

                            </select>
                        </div>
                        {
                            updateError ?.errors ?.role && <span style={{ color: "red" }}>{updateError ?.errors ?.role.message}</span>
                        }

                        {
                            isLoading ? <Button style={{ backgroundColor: "white" }} id="createProductButton" type="submit" disabled={isLoading ? true : false || role == "" ? true : false}>{<CircularProgress />}</Button> : <Button id="createProductButton" type="submit" disabled={isLoading ? true : false || role == "" ? true : false}>Update</Button>
                        }


                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateUser
