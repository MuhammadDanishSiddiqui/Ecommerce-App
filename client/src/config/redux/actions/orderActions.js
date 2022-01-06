import axios from "axios"

const createOrder = (order) => async (dispatch) => {
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

const myOrders = () => async (dispatch) => {
    try {
        dispatch({ type: "MY_ORDERS_REQUEST" })
        const { data } = await axios.get("/api/orders/me")
        dispatch({ type: "MY_ORDERS_SUCCESS", payload: data.orders })


    } catch (error) {
        dispatch({ type: "MY_ORDERS_FAIL", payload: error.response.data.message })
    }
}

const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ORDER_DETAILS_REQUEST" })
        const { data } = await axios.get(`/api/order/${id}`)
        dispatch({ type: "ORDER_DETAILS_SUCCESS", payload: data.order })


    } catch (error) {
        dispatch({ type: "ORDER_DETAILS_FAIL", payload: error.response.data.message })
    }
}

const clearErrors = () => async (dispatch) => {
    dispatch({ type: "CLEAR_ERRORS" })
}

export { createOrder, clearErrors, myOrders, getOrderDetails }