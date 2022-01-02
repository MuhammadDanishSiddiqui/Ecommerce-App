import React, { useEffect, useState } from 'react'
import pic from "../../avatar.png"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import "./profile.css"
import axios from "axios"
import { getUserProfile } from "../../config/redux/actions/userActions"
import CircularProgress from '@material-ui/core/CircularProgress'

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { user, isAuth, loading } = useSelector(state => state.user)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [avatarPreview, setAvatarPreview] = useState(user ?.avatar ?.url ? user.avatar.url : "")
    const [isEdit, setIsEdit] = useState(false)
    const [errors, setErrors] = useState({ name: "", email: "", avatar: "" })
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }

    }, [navigate, isAuth, loading])



    async function updateProfile() {
        setErrors({ name: "", email: "", avatar: "" })
        const formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("avatar", avatarPreview)
        setIsLoading(true)
        try {
            const { data } = await axios({
                method: "patch",
                url: "/api/user/me",
                headers: {
                    "content-type": "multipart/form-data"
                },
                data: formData
            })
            dispatch(getUserProfile())
            alert(data.message)
            setIsLoading(false)
            setName(data.user.name)
            setEmail(data.user.email)
            setAvatarPreview(data.user.avatar.url)
            setIsEdit(false)
            setErrors({ name: "", email: "", avatar: "" })
        } catch (error) {
            setIsLoading(false)
            if (error ?.response ?.data ?.errors ?.name) {
                setErrors({ ...errors, name: error ?.response ?.data ?.errors ?.name.message})
            }
            if (error ?.response ?.data ?.errors ?.email) {
                setErrors({ ...errors, email: error ?.response ?.data ?.errors ?.email.message})
            }

        }
    }

    return (
        <>
            {
                loading ? <div style={{ width: "100%", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div> : <div className="profile_Container">
                        <div className="left_side">
                            <h1>{isEdit ? "Edit" : "My"} Profile</h1>
                            <label htmlFor="avatar">
                                <img className="user_image" src={avatarPreview ? avatarPreview : pic} alt={user.name} disabled={!isEdit} />
                            </label>

                            <input type="file" accept="image/*" disabled={!isEdit} id="avatar" hidden onChange={async (e) => {
                                const reader = new FileReader()
                                reader.onload = () => {
                                    if (reader.readyState == 2) {
                                        setAvatarPreview(reader.result)
                                    }
                                }
                                reader.readAsDataURL(e.target.files[0])
                            }} />
                            {/* <Link to="/me/update" className="edit_btn">Edit Profile</Link> */}
                            {
                                !isEdit ? <button className="edit_btn" onClick={() => setIsEdit(true)}>Edit Profile</button> :
                                    <>
                                        <button disabled={isLoading} className="edit_btn" onClick={updateProfile}>Update Profile</button>
                                        <button disabled={isLoading} className="edit_btn" style={{ backgroundColor: "black" }} onClick={() => {
                                            setIsEdit(false)
                                            setName(user.name)
                                            setEmail(user.email)
                                            setAvatarPreview(user ?.avatar ?.url ? user.avatar.url : "")

                                        }}>Cancel</button>
                                    </>

                            }
                        </div>
                        <div className="right_side">
                            <div>
                                <h3>Name:</h3>
                                <input type="text" disabled={!isEdit} value={name} onChange={e => setName(e.target.value)} />
                                <br />
                                {errors ?.name ? <small style={{ color: "red" }}>{errors.name}</small> : null  }
                            </div>
                            <div>
                                <h3>Email:</h3>
                                <input type="email" disabled={!isEdit} value={email} onChange={e => setEmail(e.target.value)} />
                                <br />
                                {errors ?.email ? <small style={{ color: "red" }}>{errors.email}</small> : null  }
                            </div>
                            <div>
                                <h3>Role:</h3>
                                <input type="text" value={user.role} disabled />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                <Link to="/orders" className="actn_btn" style={{ marginBottom: "10px" }}>My Orders</Link>
                                <Link to="/password/update" className="actn_btn">Change Password</Link>
                            </div>
                        </div>

                    </div>
            }



        </>

    )
}

export default Profile
