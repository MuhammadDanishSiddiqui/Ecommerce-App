import { combineReducers } from "redux"
import { productReducer, productDetailReducer } from "./reducers/productReducer"
import { registerReducer, loginReducer, profileReducer } from "./reducers/userReducer"
import { cartReducer } from "./reducers/cartReducer"

const appReducer = combineReducers({
    products: productReducer,
    productDetail: productDetailReducer,
    userRegister: registerReducer,
    userLogin: loginReducer,
    user: profileReducer,
    cart: cartReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        return appReducer(undefined, action)
    }

    return appReducer(state, action)
}

export default rootReducer