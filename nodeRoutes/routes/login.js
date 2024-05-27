const express = require("express")
const User = require("../../models/user")
const jwt = require("jsonwebtoken")
const errors = require("../../globalFunctions/errors")
const router = express.Router()
const { scryptSync, timingSafeEqual } = require("crypto")

router.post("/login", async (req, res) => {
    const { userNotFound } = errors
    const user = await User.findOne({ email: req.body.email }).catch(console.log)
    if (!user) return userNotFound.send(res)
    const [salt, key] = user.password.split(":")
    const hashedBuffer = scryptSync(req.body.password, salt, 64)
    const keyBuffer = Buffer.from(key, "hex")
    const match = timingSafeEqual(keyBuffer, hashedBuffer)
    if (!match) return userNotFound.send(res)
    const accessToken = jwt.sign({ username: user.username, _id: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET)
    res.send({ accessToken })
})

module.exports = router
