import React from 'react'
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"

function ProctedRoute({ children, redirectTo, isAdmin }) {
    const { loading, isAuth, user } = useSelector(state => state.user)

    return (
        // localStorage.getItem("token") ? children : <Navigate to={redirectTo} />
        loading == false && (isAuth == false ? <Navigate to={redirectTo} /> : isAdmin == true && user.role != "admin" ? <Navigate to={redirectTo} /> : children)
    )
}

export default ProctedRoute
