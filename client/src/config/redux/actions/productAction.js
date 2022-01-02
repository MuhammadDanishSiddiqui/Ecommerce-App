import axios from "axios"

const getProducts = (keyword = "", page = 1, price = [0, 50000], category, ratings = 0) => async dispatch => {
    try {
        dispatch({ type: "FETCH_PRODUCTS_REQUEST" })
        let link = `/api/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`
        if (category) {
            link = `/api/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`
        }
        const { data } = await axios({
            method: 'GET',
            url: link,
        })
        dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: data })
    } catch (error) {
        dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.response })
    }
}

const clearErrors = () => async dispatch => {
    dispatch({ type: "CLEAR_ERRORS" })
}


const getProductDetail = (id) => async dispatch => {
    try {
        dispatch({ type: "PRODUCT_DETAIL_REQUEST" })
        const { data } = await axios({
            method: 'GET',
            url: `/api/product/${id}`,
        })
        dispatch({ type: "PRODUCT_DETAIL_SUCCESS", payload: data.product })
    } catch (error) {
        dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.response })
    }
}


export { getProducts, clearErrors, getProductDetail }

