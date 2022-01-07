import React, { useState, useEffect } from 'react'
import "./Register.css"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import CircularProgress from '@material-ui/core/CircularProgress'
import { loginUser, clearErrors, getUserProfile } from "../../config/redux/actions/userActions"
import { useNavigate } from 'react-router-dom'
import axios from "axios"


function Login({ isLoading }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error, message, token } = useSelector(state => state.userLogin)
    const { isAuth } = useSelector(state => state.user)
    const [user, setUser] = useState({ password: "", email: "" })
    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        dispatch(clearErrors())
        e.preventDefault()
        dispatch(loginUser(user))
    }

    useEffect(() => {
        if (isAuth) {
            return navigate(localStorage.getItem("currentPath") == "/login" ? "/profile" : localStorage.getItem("currentPath"))
        }

        if (token) {
            localStorage.setItem("token", token)
            axios.defaults.headers.common['Authorization'] = "Bearer " + token
            dispatch(getUserProfile())

        }
    }, [dispatch, token, isAuth])
    return (

        <>
            {
                isLoading ? <div style={{ width: "100%", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div> : <>
                        <div className="extraUser">

                        </div>
                        <form className={"register_user_wrapper"} onSubmit={handleSubmit} >
                            <h3 style={{ backgroundColor: "blue", color: "white", width: "100%", textAlign: "center", padding: "10px", fontSize: "25px", marginBottom: "20px" }}>Login</h3>
                            <input disabled={loading} type="email" value={user.email} name="email" placeholder="Enter your email" onChange={handleChange} />
                            {
                                error ?.errors ?.email && <small style={{ color: "red" }}> {error ?.errors ?.email.message} </small> 
                }
                            <input disabled={loading} type="password" value={user.password} name="password" placeholder="Enter your password" onChange={handleChange} />
                            {
                                error ?.errors ?.password && <small style={{ color: "red", marginBottom: "10px" }}> {error ?.errors ?.password.message} </small> 
                }
                            {
                                error ?.error && <small style={{ color: "red", marginBottom: "10px" }}> {error.error} </small> 
                }
                            {
                                loading ? <CircularProgress /> : <button>Submit</button>
                            }
                            <p style={{ marginTop: "10px" }}><Link style={{ textDecoration: "none" }} to="/password/forgot">Forgot Password ? </Link> </p>

                            <p style={{ marginTop: "10px" }}>Don't have an account ? <Link style={{ textDecoration: "none" }} to="/register">Register</Link> </p>

                        </form>
                    </>
            }

        </>
    )
}

export default Login