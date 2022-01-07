import { combineReducers } from "redux"
import { productReducer, productDetailReducer, newReviewReducer, adminProductReducer, newProductReducer } from "./reducers/productReducer"
import { registerReducer, loginReducer, profileReducer } from "./reducers/userReducer"
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer } from "./reducers/orderReducer"
import { cartReducer } from "./reducers/cartReducer"

const appReducer = combineReducers({
    products: productReducer,
    productDetail: productDetailReducer,
    userRegister: registerReducer,
    userLogin: loginReducer,
    user: profileReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    adminProducts: adminProductReducer,
    newProduct: newProductReducer,
    allOrders: allOrdersReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        return appReducer(undefined, action)
    }

    return appReducer(state, action)
}

export default rootReducer