const registerReducer = (state = {}, action) => {
    switch (action.type) {
        case "REGISTER_REQUEST":
            return {
                ...state,
                loading: true,
            }
        case "REGISTER_SUCCESS":
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        case "REGISTER_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

const loginReducer = (state = { token: "" }, action) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
            return {
                ...state,
                loading: true,
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                loading: false,
                token: action.payload.token,
                message: action.payload.message
            }
        case "LOGIN_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload,
                token: "",
                message: ""
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

const profileReducer = (state = { user: {}, isAuth: false, }, action) => {
    switch (action.type) {
        case "PROFILE_REQUEST":
            return {
                ...state,
                loading: true,
            }
        case "PROFILE_SUCCESS":
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                isAuth: true
            }
        case "PROFILE_FAIL":
            return {
                ...state,
                loading: false,
                error: action.payload,
                isAuth: false,
                user: ""
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export { registerReducer, loginReducer, profileReducer }