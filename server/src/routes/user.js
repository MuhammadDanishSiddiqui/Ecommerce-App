const express = require("express")
const router = new express.Router()
const User = require("../models/user")
const auth = require("../middleware/auth")
const authRoles = require("../middleware/authRoles")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")
const bcrypt = require("bcrypt")

router.post("/user/register", async (req, res) => {
    try {
        let myCloud
        if (req.body.avatar) {
            myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            })
        }

        const user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).send({ error: "user already exit" })
        }
        const newUser = new User({ ...req.body, avatar: { public_id: myCloud ?.public_id, url: myCloud ?.secure_url } })
        await newUser.save()
        res.status(201).send({ message: "Registered successfully", user: newUser })
    } catch (error) {

        res.status(400).send(error)
    }
})

router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ message: "Logged in successfully", token })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send({ message: "Logged out successfully" })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ message: "Logged out from all devices successfully" })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/user/me", auth, (req, res) => {
    res.send({ user: req.user })
})

router.patch("/user/me", auth, async (req, res) => {
    try {
        let myCloud
        if (req.body.avatar) {
            await cloudinary.v2.uploader.destroy(req ?.user ?.avatar ?.public_id)
            myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            })
        }
        const upatedUser = await User.findByIdAndUpdate(req.user._id, { ...req.body, avatar: { public_id: myCloud ?.public_id, url: myCloud ?.secure_url } }, { new: true, runValidators: true })
        res.send({ message: "Profile updated successfully", user: upatedUser })
    } catch (error) {
        res.status(400).send(error)
    }

})


router.patch("/password/update", auth, async (req, res) => {
    try {
        if (!req.body.oldPassword || !req.body.newPassword || !req.body.confirmPassword) {
            return res.status(400).send({ error: "Please fill all the fields." })
        }
        const user = await User.findById(req.user._id)

        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password)

        if (!isMatch) {
            return res.status(400).send({ error: "Old password is incorrect." })
        }

        if (req.body.newPassword != req.body.confirmPassword) {
            return res.status(400).send({ error: "Password did not match " })
        }

        user.password = req.body.newPassword
        await user.save()
        res.send({ message: "Password updated successfully." })

    } catch (error) {
        res.status(400).send(error)
    }

})



router.get("/admin/users", auth, authRoles, async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/admin/user/:id", auth, authRoles, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send({ error: "user not found" })
        }
        res.send({ user })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/admin/user/:id", auth, authRoles, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send({ error: "user not found" })
        }
        const upatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        await upatedUser.save()
        res.send({ message: "User updated successfully", user: upatedUser })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete("/admin/user/:id", auth, authRoles, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({ error: "user not found" })
        }
        res.send({ message: "User deleted successfully", user })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/password/forgot", async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send({ error: "User not found" })
    }
    const resetToken = user.generateResetPasswordToken()
    await user.save()
    // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce password recovery",
            message
        })
        res.send({ message: `Email sent to ${user.email} successfully.` })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        res.status(500).send(error)
    }

})

router.patch("/password/reset/:token", async (req, res) => {
    try {
        if (!req.body.newPassword || !req.body.confirmPassword) {
            return res.status(400).send({ error: "Please fill both fileds." })
        }
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
        if (!user) {
            return res.status(400).send({ error: "Reset password token is invalid or has been expired." })
        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).send({ error: "Password does not match." })
        }
        user.password = req.body.newPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        res.send({ message: "Your password has been reset successfully" })
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router