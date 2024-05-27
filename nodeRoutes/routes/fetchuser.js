const authenticateToken = require("../../globalFunctions/authenticateToken")
const User = require("../../models/user")
const express = require("express")
const router = express.Router()

router.get("/fetch/:user", authenticateToken, async (req, res) => {
    const user = await User.findById(req.params.user)
    if (!user) return res.status(500).send("error")
    const data = {
        username: user.username,
        tag: user.tag,
        online: user.online,
        avatarURL: user.avatarURL
    }
    res.send(data)
})

module.exports = router