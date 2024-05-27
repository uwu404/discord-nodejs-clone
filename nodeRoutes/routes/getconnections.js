const express = require("express")
const errors = require("../../globalFunctions/errors")
const serverConnections = require("../../globalFunctions/serverconnections")
const router = express.Router()
const Server = require("../../models/server")
const User = require("../../models/user")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.get("/user/connections", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const invalidTokenError = errors.invalidToken
    if (!user) return res.status(invalidTokenError.status).send(invalidTokenError.error)
    const servers = await Server.find({ members: user._id })
        .populate("channels")
        .populate("members")
    const channels = []
    for (const server of servers) {
        const VCconnections = await serverConnections(server)
        channels.push(...VCconnections)
    }
    res.send(channels)
})

module.exports = router