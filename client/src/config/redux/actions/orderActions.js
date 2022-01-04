import axios from "axios"

const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: "CREATE_ORDER_REQUEST" })
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const { data } = await axios.post("/api/order", order, config)
        dispatch({ type: "CREATE_ORDER_SUCCESS", payload: data })


    } catch (error) {
        dispatch({ type: "CREATE_ORDER_FAIL", payload: error.response.data.message })
    }
}

const myOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "MY_ORDERS_REQUEST" })
        const { data } = await axios.get("/api/orders/me")
        dispatch({ type: "MY_ORDERS_SUCCESS", payload: data.orders })


    } catch (error) {
        dispatch({ type: "MY_ORDERS_FAIL", payload: error.response.data.message })
    }
}

const clearErrors = () => async (dispatch) => {
    dispatch({ type: "CLEAR_ERRORS" })
}

export { createOrder, clearErrors, myOrders }