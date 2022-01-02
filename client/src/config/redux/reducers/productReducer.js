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

export { productReducer, productDetailReducer }