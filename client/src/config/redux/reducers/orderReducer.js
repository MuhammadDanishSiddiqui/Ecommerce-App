const newOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case "CREATE_ORDER_REQUEST":
            return {
                ...state,
                loading: true
            }
        case "CREATE_ORDER_SUCCESS":
            return {
                loading: false,
                order: action.payload
            }
        case "CREATE_ORDER_FAIL":
            return {
                loading: false,
                error: action.payload
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

const myOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case "MY_ORDERS_REQUEST":
            return {
                loading: true
            }
        case "MY_ORDERS_SUCCESS":
            return {
                loading: false,
                orders: action.payload
            }
        case "MY_ORDERS_FAIL":
            return {
                loading: false,
                error: action.payload
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

const allOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case "ALL_ORDERS_REQUEST":
            return {
                loading: true
            }
        case "ALL_ORDERS_SUCCESS":
            return {
                loading: false,
                orders: action.payload
            }
        case "ALL_ORDERS_FAIL":
            return {
                loading: false,
                error: action.payload
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

const orderDetailsReducer = (state = { order: {} }, action) => {
    switch (action.type) {
        case "ORDER_DETAILS_REQUEST":
            return {
                loading: true
            }
        case "ORDER_DETAILS_SUCCESS":
            return {
                loading: false,
                order: action.payload
            }
        case "ORDER_DETAILS_FAIL":
            return {
                loading: false,
                error: action.payload
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}


export { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer }