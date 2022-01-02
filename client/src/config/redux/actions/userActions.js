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
            return dispatch({ type: "REGISTER_FAIL", payload: "No internet connection" })
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
            return dispatch({ type: "LOGIN_FAIL", payload: "No internet connection" })
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
            return dispatch({ type: "PROFILE_FAIL", payload: "No internet connection" })
        }
        dispatch({ type: "PROFILE_FAIL", payload: error.response.data })
    }
}

const clearErrors = () => (dispatch) => {
    dispatch({ type: "CLEAR_ERRORS" })
}

export { registerUser, clearErrors, loginUser, getUserProfile }