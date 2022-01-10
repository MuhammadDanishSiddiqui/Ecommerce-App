import React, { useState, useEffect } from 'react'
import axios from "axios"
import CircularProgress from '@material-ui/core/CircularProgress'
import "./Forgot.css"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {
    const navigate = useNavigate()
    const { isAuth } = useSelector(state => state.user)
    const [email, setEmail] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()


    useEffect(() => {
        if (isAuth) {
            navigate(localStorage.getItem("currentPath") === "/password/forgot" ? "/profile" : localStorage.getItem("currentPath"))
        }
    }, [isAuth, navigate])

    async function forgotPassword() {
        if (!email) {
            return setError("Please enter email.")
        }
        setError(null)
        try {
            setLoading(true)
            const { data } = await axios({
                method: "post",
                url: "/api/password/forgot",
                headers: {
                    "content-type": "application/json"
                },
                data: JSON.stringify({ email })
            })
            setLoading(false)
            alert(data.message)
            setEmail("")
            setError(null)
        } catch (error) {
            setLoading(false)
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error)
            }
        }
    }


    return (
        <>
            <div className="extraUser"></div>
            <div className="register_user_wrapper">
                <h3 style={{ backgroundColor: "blue", color: "white", width: "100%", textAlign: "center", padding: "10px", fontSize: "25px", marginBottom: "20px" }}>Forgot Password</h3>
                <div>
                    <h3>Email:</h3>
                    <input disabled={loading} placeholder="Enter Your Email" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="email" value={email} required onChange={e => setEmail(e.target.value)} />
                    <br />
                </div>
                {
                    error ? <small style={{ color: "red" }}>{error}</small> : null
                }
                <div style={{ marginTop: "10px" }}>
                    {
                        loading ? <CircularProgress /> : <button onClick={forgotPassword} style={{ backgroundColor: "black", color: "white", padding: "10px", display: "inline-block", outline: "none", border: "1px solid black", width: "250px", cursor: "pointer" }}>Send</button>
                    }

                </div>
            </div>
        </>
    )
}

export default ForgotPassword
