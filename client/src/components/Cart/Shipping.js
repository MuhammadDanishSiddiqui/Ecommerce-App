import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { saveShippingInfo } from "../../config/redux/actions/cartActions"
import { Country, State } from "country-state-city"
import "./Shipping.css"
import CheckoutSteps from "./CheckoutSteps"
import { useNavigate } from "react-router-dom"

function Shipping() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { shippingInfo } = useSelector(state => state.cart)
    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [state, setState] = useState(shippingInfo.state)
    const [country, setCountry] = useState(shippingInfo.country)
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode)
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)
    const [error, setError] = useState()


    function shippingSubmit(e) {
        e.preventDefault()
        if (phoneNo.length < 11 || phoneNo.length > 11)
            return setError("Phone number should be 11 digits.")
        dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo }))
        navigate("/order/confirm")
    }
    return (
        <>
            <CheckoutSteps activeStep={0} />
            <div className="register_user_wrapper">
                <h3 style={{ backgroundColor: "blue", color: "white", width: "100%", textAlign: "center", padding: "10px", fontSize: "25px", marginBottom: "20px" }}>Shipping Details</h3>
                <form onSubmit={shippingSubmit}>
                    <div>
                        <h3>Address:</h3>
                        <input placeholder="Address" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="text" value={address} required onChange={e => setAddress(e.target.value)} />
                        <br />
                    </div>
                    <div>
                        <h3>City:</h3>
                        <input placeholder="City" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="text" value={city} required onChange={e => setCity(e.target.value)} />
                        <br />
                    </div>
                    <div>
                        <h3>Pin Code:</h3>
                        <input placeholder="Pin Code" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="number" value={pinCode} required onChange={e => setPinCode(e.target.value)} />
                        <br />
                    </div>
                    <div>
                        <h3>Phone Number:</h3>
                        <input placeholder="Phone Number" style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} type="number" value={phoneNo} required onChange={e => setPhoneNo(e.target.value)} />
                        <br />
                    </div>
                    {
                        error && <span style={{ color: "red" }}>{error}</span>
                    }
                    < div >
                        <h3>Country:</h3>
                        <select style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} value={country} required onChange={e => setCountry(e.target.value)}>
                            <option value="">Country</option>

                            {
                                Country && Country.getAllCountries().map(item => {
                                    return <option key={item.name} value={item.isoCode}>{item.name}</option>
                                })
                            }
                        </select>
                    </div >

                    {country && (< div >
                        <h3>State:</h3>
                        <select style={{ width: "250px", padding: "7px", fontSize: "15px", border: "1px solid black", outline: "none", marginBottom: "10px" }} value={state} required onChange={e => setState(e.target.value)}>
                            <option value="">State</option>

                            {
                                State && State.getStatesOfCountry(country).map(item => {
                                    return <option key={item.name} value={item.isoCode}>{item.name}</option>
                                })
                            }
                        </select>
                    </div >)}

                    <div style={{ marginTop: "10px" }}>

                        <button disabled={state ? false : true} type="submit" style={{ backgroundColor: !state ? "lightgray" : "black", color: !state ? "black" : "white", padding: "10px", display: "inline-block", outline: "none", border: "1px solid black", width: "250px", cursor: "pointer" }}>Continue</button>


                    </div>
                </form>
            </div>
        </>
    )
}

export default Shipping


