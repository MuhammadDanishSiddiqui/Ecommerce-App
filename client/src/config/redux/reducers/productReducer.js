const productReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS_REQUEST":
            return {
                loading: true,
                products: []
            }

        case "FETCH_PRODUCTS_SUCCESS":
            return {
                loading: false,
                products: action.payload.products,
                productsCount: action.payload.productsCount,
                resultPerPage: action.payload.resultPerPage,
                filteredProductsCount: action.payload.filteredProductsCount
            }
        case "FETCH_PRODUCTS_FAILURE":
            return {
                loading: false,
                error: action.payload,
                products: []
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

const newProductReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case "NEW_PRODUCT_REQUEST":
            return {
                loading: true,
                ...state
            }

        case "NEW_PRODUCT_SUCCESS":
            return {
                loading: false,
                product: action.payload.product,
                message: action.payload.message
            }
        case "NEW_PRODUCT_FAILURE":
            return {
                loading: false,
                error: action.payload,
                products: []
            }
        case "NEW_PRODUCT_RESET":
            return {
                ...state,
                loading: false,
                message: null
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

const adminProductReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case "ADMIN_PRODUCTS_REQUEST":
            return {
                loading: true,
                products: []
            }

        case "ADMIN_PRODUCTS_SUCCESS":
            return {
                loading: false,
                products: action.payload,
            }
        case "ADMIN_PRODUCTS_FAILURE":
            return {
                loading: false,
                error: action.payload,
                products: []
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

const productDetailReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case "PRODUCT_DETAIL_REQUEST":
            return {
                loading: true,
                ...state
            }

        case "PRODUCT_DETAIL_SUCCESS":
            return {
                loading: false,
                product: action.payload
            }
        case "PRODUCT_DETAIL_FAILURE":
            return {
                loading: false,
                error: action.payload,
                product: {}
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

const newReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case "NEW_REVIEW_REQUEST":
            return {
                loading: true,
                ...state
            }

        case "NEW_REVIEW_SUCCESS":
            return {
                loading: false,
                message: action.payload
            }
        case "NEW_REVIEW_FAIL":
            return {
                loading: false,
                error: action.payload,
                ...state
            }
        case "NEW_REVIEW_RESET":
            return {
                ...state,
                loading: false,
                message: null
            }
        case "CLEAR_ERRORS":
            return {
                ...state,
                error: null
            }
        default: return state
    }
}

export { productReducer, productDetailReducer, newReviewReducer, adminProductReducer, newProductReducer }