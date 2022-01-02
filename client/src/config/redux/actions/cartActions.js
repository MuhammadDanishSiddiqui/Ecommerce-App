import axios from "axios"

const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    try {
        const { data } = await axios({
            method: "get",
            url: `/api/product/${id}`,
        })
        dispatch({
            type: "ADD_TO_CART", payload: {
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.images[0].url,
                stock: data.product.stock,
                quantity
            }
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
    } catch (error) {
        console.log(error)
    }
}

const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: "REMOVE_FROM_CART", payload: id
    })
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
}

const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: "SAVE_SHIPPING_INFO", payload: data
    })
    localStorage.setItem("shippingInfo", JSON.stringify(data))
}

export { addItemsToCart, removeItemsFromCart, saveShippingInfo }