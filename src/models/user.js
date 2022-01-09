const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."],
        trim: true,
        maxlength: [15, "Name can not exceed 15 characters."],
        minlength: [3, "Name must be 3 characters long."]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
        minlength: [8, "Password must contain atleast 8 characters"]
    },
    avatar: {
        public_id: {
            type: String,
            // required: true
            default: ""
        },
        url: {
            type: String,
            // required: true
            default: ""
        }
    },
    role: {
        type: String,
        default: "user"
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Invalid Credentials.")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Invalid Credentials.")
    }
    return user
}


userSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = new mongoose.model("User", userSchema)

module.exports = User