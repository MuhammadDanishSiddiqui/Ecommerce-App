import React from 'react'
import { Navigate } from "react-router-dom";

function ProctedRoute({ children, redirectTo }) {

    return (
        localStorage.getItem("token") ? children : <Navigate to={redirectTo} />
    )
}

export default ProctedRoute
