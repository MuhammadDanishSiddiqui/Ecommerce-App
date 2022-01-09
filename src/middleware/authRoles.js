const authRoles = (req, res, next) => {
    if (req.user.role == "admin") {
        return next()
    }
    res.status(401).send({ error: "Only admins are allowed to access this resource" })

}

module.exports = authRoles