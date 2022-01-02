const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description."],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please enter product price."]
    },
    category: {
        type: String,
        required: [true, "Please enter product category."],
        lowercase: true
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
    ],
    ratings: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

const Product = new mongoose.model("Product", productSchema)

module.exports = Product