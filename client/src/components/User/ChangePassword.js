import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import "./Forgot.css"

function ChangePassword() {
    const navigate = useNavigate()
    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    async function updatePassword() {
        setError(null)
        try {
            setLoading(true)
            const { data } = await axios({
                method: "patch",
                url: "/api/password/update",
                headers: {
                    "content-type": "application/json"
                },
                data: JSON.stringify({ oldPassword, newPassword, confirmPassword })
            })
            setLoading(false)
            alert(data.message)
            setError(null)
            navigate("/profile")
        } catch (error) {
            setLoading(false)
            if (error ?.response ?.data ?.errors ?.password ?.message) {
                setError(error ?.response ?.data ?.errors ?.password ?.message)
            }
            if (error ?.response ?.data ?.error) {
                setError(error ?.response ?.data ?.error)
            }
            console.log(error)
        }
    }

    return (
        <>
            <div className="extraUser"></div>
            <div className="register_user_wrapper">
                <h3 style={{ backgroundColor: "blue", color: "white", width: "100%", textAlign: "center", padding: "10px", fontSize: "25px", marginBottom: "20px" }}>Change Password</h3>
                <div>
                    <h3>Old Password:</h3>
                    <input disabled={loading} placeholder="Enter Old Password" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="password" value={oldPassword} required onChange={e => setOldPassword(e.target.value)} />
                    <br />
                </div>
                <div>
                    <h3>New Password:</h3>
                    <input disabled={loading} placeholder="Enter New Password" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="password" value={newPassword} required onChange={e => setNewPassword(e.target.value)} />
                    <br />
                </div>
                <div>
                    <h3>Confirm Password:</h3>
                    <input disabled={loading} placeholder="Enter Confirm Password" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="password" value={confirmPassword} required onChange={e => setConfirmPassword(e.target.value)} />
                    <br />
                </div>
                {
                    error ? <small style={{ color: "red" }}>{error}</small> : null
                }
                <div style={{ marginTop: "10px" }}>
                    {
                        loading ? <CircularProgress /> : <button onClick={updatePassword} style={{ backgroundColor: "black", color: "white", padding: "10px", display: "inline-block", outline: "none", border: "1px solid black", width: "250px", cursor: "pointer" }}>Change</button>
                    }

                </div>
            </div>
        </>
    )
}

export default ChangePassword
