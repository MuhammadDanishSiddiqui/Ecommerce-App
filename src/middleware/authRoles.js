const authRoles = (req, res, next) => {
    try {
        if (req.user.role == "admin") {
            return next()
        }
        else {
            throw new Error()
        }

    } catch (error) {
        res.status(401).send({ error: "Only admins are allowed to access this resource" })
    }

}

module.exports = authRoles