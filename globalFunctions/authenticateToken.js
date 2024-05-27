const jwt = require("jsonwebtoken")
const errors = require("./errors")

const authenticateToken = (req, res, next) => {
    const { invalidToken, unknownError } = errors
    const authHeader = req.headers["authorization"]
    const token = authHeader?.split(" ")[1]
    if (!token) return invalidToken.send(res)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return unknownError.send(res)
        req.user = user
        next()
    })
}

module.exports = authenticateToken