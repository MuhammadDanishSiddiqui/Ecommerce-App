const Order = require("../models/order")
const Product = require("../models/product")
const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const authRoles = require("../middleware/authRoles")

router.post("/order", auth, async (req, res) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    const order = new Order({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id
    })
    await order.save()
    res.status(201).send({ order })
})

router.get("/order/:id", auth, async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if (!order) {
        return res.status(404).send({ error: "Order not found" })
    }
    res.send({ order })
})

router.get("/orders/me", auth, async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.send({ orders })
})

router.get("/admin/orders", auth, authRoles, async (req, res) => {
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })
    res.send({ orders, totalAmount })
})

router.patch("/admin/order/:id", auth, authRoles, async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return res.status(404).send({ error: "Order not found" })
    }
    if (order.orderStatus == "Delievered") {
        return res.status(400).send({ error: "You have already delievered this order." })
    }
    order.orderItems.forEach(async order => {
        await updateStock(order.product, order.quantity)
    })
    order.orderStatus = req.body.status
    if (req.body.status == "Delievered") {
        order.deleiveredAt = Date.now()
    }
    await order.save()
    res.send({ message: "Status updated successfully" })
})

async function updateStock(id, qty) {
    const product = await Product.findById(id)
    product.stock = product.stock - qty
    await product.save()
}

router.delete("/admin/order/:id", auth, authRoles, async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return res.status(404).send({ error: "Order not found" })
    }
    await order.remove()
    res.send({ message: "Order deleted successfully" })
})

module.exports = router