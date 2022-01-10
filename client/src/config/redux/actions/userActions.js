import axios from "axios"

const registerUser = (body) => async (dispatch) => {
    try {
        dispatch({ type: "REGISTER_REQUEST" })
        const response = await axios({
            method: "post",
            url: "/api/user/register",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: body
        })
        dispatch({ type: "REGISTER_SUCCESS", payload: response.data })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "REGISTER_FAIL", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "REGISTER_FAIL", payload: error.response.data })
    }
}

const loginUser = (body) => async (dispatch) => {
    try {
        dispatch({ type: "LOGIN_REQUEST" })
        const response = await axios({
            method: "post",
            url: "/api/user/login",
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(body)
        })
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "LOGIN_FAIL", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "LOGIN_FAIL", payload: error.response.data })
    }
}

const getUserProfile = () => async (dispatch) => {
    try {
        dispatch({ type: "PROFILE_REQUEST" })
        const response = await axios({
            method: "get",
            url: "/api/user/me",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        dispatch({ type: "PROFILE_SUCCESS", payload: response.data })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "PROFILE_FAIL", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "PROFILE_FAIL", payload: error.response.data })
    }
}

const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: "ALL_USERS_REQUEST" })
        const response = await axios({
            method: "get",
            url: "/api/admin/users",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        dispatch({ type: "ALL_USERS_SUCCESS", payload: response.data })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "ALL_USERS_FAIL", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "ALL_USERS_FAIL", payload: error.response.data })
    }
}


const getUserDetail = (id) => async (dispatch) => {
    try {
        dispatch({ type: "USER_DETAIL_REQUEST" })
        const response = await axios({
            method: "get",
            url: "/api/admin/user/" + id,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        dispatch({ type: "USER_DETAIL_SUCCESS", payload: response.data })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "USER_DETAIL_FAIL", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "USER_DETAIL_FAIL", payload: error.response.data })
    }
}

const clearErrors = () => (dispatch) => {
    dispatch({ type: "CLEAR_ERRORS" })
}

export { registerUser, clearErrors, loginUser, getUserProfile, getAllUsers, getUserDetail }