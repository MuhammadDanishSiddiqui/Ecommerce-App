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
        if (!error.response) {
            return dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.response.data })
    }
}

const getAdminProducts = () => async dispatch => {
    try {
        dispatch({ type: "ADMIN_PRODUCTS_REQUEST" })
        const { data } = await axios({
            method: 'GET',
            url: "/api/admin/products",
        })
        dispatch({ type: "ADMIN_PRODUCTS_SUCCESS", payload: data.products })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "ADMIN_PRODUCTS_FAILURE", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "ADMIN_PRODUCTS_FAILURE", payload: error.response.data })
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
        if (!error.response) {
            return dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: error.response.data })
    }
}

const newReview = (newReviewData) => async dispatch => {
    try {
        dispatch({ type: "NEW_REVIEW_REQUEST" })
        const { data } = await axios({
            method: 'PATCH',
            url: `/api/review`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: newReviewData

        })
        dispatch({ type: "NEW_REVIEW_SUCCESS", payload: data.message })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "NEW_REVIEW_FAIL", payload: "No Internet Connetion." })
        }
        dispatch({ type: "NEW_REVIEW_FAIL", payload: error.response.data.message })
    }
}

const createProduct = (productData) => async dispatch => {
    try {
        dispatch({ type: "NEW_PRODUCT_REQUEST" })
        const { data } = await axios({
            method: 'POST',
            url: `/api/admin/product`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: productData

        })
        dispatch({ type: "NEW_PRODUCT_SUCCESS", payload: data })
    } catch (error) {
        if (!error.response) {
            return dispatch({ type: "NEW_PRODUCT_FAILURE", payload: { error: "No Internet Connection." } })
        }
        dispatch({ type: "NEW_PRODUCT_FAILURE", payload: error.response.data })
    }
}


export { getProducts, clearErrors, getProductDetail, newReview, getAdminProducts, createProduct }

