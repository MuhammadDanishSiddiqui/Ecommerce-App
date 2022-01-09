import React, { useState, useEffect } from 'react'
import "./Register.css"
import pic from "../../avatar.png"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import CircularProgress from '@material-ui/core/CircularProgress'
import { registerUser, clearErrors } from "../../config/redux/actions/userActions"
import { useNavigate } from 'react-router-dom'

function Register({ isLoading }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error, message } = useSelector(state => state.userRegister)
    const { isAuth } = useSelector(state => state.user)
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", avatar: "" })
    const [avatarPreview, setAvatarPreview] = useState()
    function handleChange(e) {
        if (e.target.name == "avatar") {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState == 2) {
                    setAvatarPreview(reader.result)
                    setNewUser({ ...newUser, avatar: reader.result })
                }
            }
            reader.readAsDataURL(e.target.files[0])
            return
        }
        setNewUser({ ...newUser, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        dispatch(clearErrors())
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", newUser.name)
        formData.append("email", newUser.email)
        formData.append("password", newUser.password)
        formData.append("avatar", newUser.avatar)
        dispatch(registerUser(formData))
    }


    useEffect(() => {
        if (isAuth) {
            return navigate(localStorage.getItem("currentPath") == "/register" ? "/profile" : localStorage.getItem("currentPath"))
        }
        if (message) {
            alert(message)
            navigate("/login")
        }
    }, [dispatch, message, isAuth])
    return (
        <>
            {
                isLoading ? <div style={{ width: "100%", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div> :
                    <>
                        <div className="extraUser"></div>
                        <form className={"register_user_wrapper"} onSubmit={handleSubmit} >
                            <h3 style={{ backgroundColor: "blue", color: "white", width: "100%", textAlign: "center", padding: "10px", fontSize: "25px", marginBottom: "20px" }}>Register</h3>
                            <input disabled={loading} type="text" value={newUser.name} name="name" placeholder="Enter your name" onChange={handleChange} />
                            {
                                error ?.errors ?.name && <small style={{ color: "red" }}> {error ?.errors ?.name.message} </small> 
                }
                            <input disabled={loading} type="email" value={newUser.email} name="email" placeholder="Enter your email" onChange={handleChange} />
                            {
                                error ?.errors ?.email && <small style={{ color: "red" }}> {error ?.errors ?.email.message} </small> 
                }
                            <input disabled={loading} type="password" value={newUser.password} name="password" placeholder="Enter your password" onChange={handleChange} />
                            {
                                error ?.errors ?.password && <small style={{ color: "red", marginBottom: "10px" }}> {error ?.errors ?.password.message} </small> 
                }
                            <label htmlFor="avatar">
                                <img src={!avatarPreview ? pic : avatarPreview} alt="avatar" />
                            </label>
                            <input id="avatar" accept="image/*" type="file" name="avatar" hidden onChange={handleChange} />
                            {
                                error ?.error && <small style={{ color: "red", marginBottom: "10px" }}> {error.error} </small> 
                }
                            {
                                loading ? <CircularProgress /> : <button>Submit</button>
                            }



                            <p style={{ marginTop: "10px" }}>Already have an account ? <Link style={{ textDecoration: "none" }} to="/login">Login</Link> </p>
                        </form>
                    </>
            }

        </>
    )
}

export default Register