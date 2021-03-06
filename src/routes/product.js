const express = require("express")
const router = new express.Router()
const Product = require("../models/product")
const auth = require("../middleware/auth")
const authRoles = require("../middleware/authRoles")
const ApiFeatures = require("../utils/apiFeature")
const cloudinary = require("cloudinary")




router.post("/admin/product", auth, authRoles, async (req, res) => {
    try {
        let images = []
        if (typeof req.body.images == "string") {
            images.push(req.body.images)
        }
        else {
            images = req.body.images
        }

        const imagesLink = []

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
                width: 300,
                height: 380
            })
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        }

        req.body.images = imagesLink
        const product = new Product({ ...req.body, user: req.user._id })
        await product.save()
        res.status(201).send({ message: "Product added successfully", product })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch("/admin/product/:id", auth, authRoles, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ["name", "description", "price", "category", "images", "stock"]
        const isValidUpdates = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdates) {
            return res.status(400).send({ error: "Invalid updates" })
        }
        const product = await Product.findOne({ _id: req.params.id })
        if (!product) {
            return res.status(404).send({ error: "Product not found" })
        }

        let images = []
        if (typeof req.body.images == "string") {
            images.push(req.body.images)
        }
        else {
            images = req.body.images
        }

        if (images != undefined) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            }
            const imagesLink = []

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                    width: 300,
                    height: 380
                })
                imagesLink.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })

            }

            req.body.images = imagesLink
        }



        updates.forEach(update => {
            product[update] = req.body[update]
        })
        await product.save()
        res.send({ message: "Product updated successfully", product })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete("/admin/product/:id", auth, authRoles, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).send({ error: "Product not found" })
        }

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        const deletedpProduct = await Product.findByIdAndDelete(req.params.id)
        res.send({ message: "Product deleted successfully", product: deletedpProduct })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).send({ error: "Product not found" })
        }
        res.send({ message: "Product fetched successfully", product })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get("/products", async (req, res) => {
    try {
        const resultPerPage = 4
        const productsCount = await Product.countDocuments()
        // const currentPage = req.query.page ? req.query.page : 1
        const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
        let products = await apiFeature.query
        let filteredProductsCount = products.length
        apiFeature.pagination(resultPerPage)
        products = await apiFeature.query.clone()
        res.send({ products, productsCount, resultPerPage, filteredProductsCount })

    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/admin/products", auth, authRoles, async (req, res) => {
    try {
        const products = await Product.find()
        res.send({
            products
        })

    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/reviews", async (req, res) => {
    try {
        const product = await Product.findById(req.query.id)
        if (!product) {
            return res.status(404).send({ error: "Product not found" })
        }
        res.send({ reviews: product.reviews })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.patch("/review", auth, async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }
        const product = await Product.findById(productId)
        const isReviewed = product.reviews && product.reviews.find(rev => rev.user && rev.user.toString() == req.user && req.user._id.toString())
        if (isReviewed) {
            product.reviews && product.reviews.forEach(rev => {
                if (rev.user && rev.user.toString() == req.user._id.toString()) {
                    rev.rating = rating
                    rev.comment = comment
                }
            })
        }
        else {
            product && product.reviews && product.reviews.push(review)
        }
        product.numOfReviews = product.reviews.length
        let avg = 0
        product && product.reviews && product.reviews.forEach(rev => {
            avg += rev.rating
        })
        if (product.reviews.length != 0) {
            product.ratings = avg / product.reviews.length
        }

        await product.save()
        res.send({ message: "Review added successfully", product })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete("/review", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.query.productId)
        if (!product) {
            return res.status(404).send({ error: "Product not found." })
        }
        const reviews = product && product.reviews && product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())
        let avg = 0
        reviews.forEach(rev => {
            avg += rev.rating
        })
        let ratings = 0
        if (reviews.length == 0) {
            ratings = 0
        } else {
            ratings = avg / reviews.length
        }

        const numOfReviews = reviews.length
        await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true })
        res.send({ message: "Review deleted successfully" })
    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router