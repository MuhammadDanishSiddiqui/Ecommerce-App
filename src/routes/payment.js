const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")


router.post("/process/payment", auth, async (req, res) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            metadata: {
                company: "Ecommerce"
            }
        })
        res.send({ success: true, client_secret: myPayment.client_secret })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get("/stripeapikey", auth, async (req, res) => {
    try {
        res.send({ stripeApiKey: process.env.STRIPE_API_KEY })
    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router