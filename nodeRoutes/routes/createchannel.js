const Channel = require("../../models/channel")
const Server = require("../../models/server")
const User = require("../../models/user")
const express = require("express")
const router = express.Router()
const { io } = require("../../")
const errors = require("../../globalFunctions/errors")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.post("/servers/:server/channels", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const server = await Server.findById(req.params.server)
    const channelName = req.body.name

    const { invalidArgs, invalidToken, noPerms } = errors
    const sendError = (error) => res.status(error.status).send(error.error)
    if (!user) return sendError(invalidToken)
    if (!server) return sendError(invalidArgs)
    if (!channelName || channelName.length > 30 || typeof channelName !== "string") return sendError(invalidArgs)
    if (!server.owner.equals(user._id)) return sendError(noPerms) // only a server owner can create a channel

    const channel = await new Channel({
        name: channelName.trim().replaceAll(" ", "-"),
        server: server._id,
        type: req.body.type
    }).save()
    
    server.channels.push(channel._id)
    await server.save()
    res.send(channel)
    io.to(server._id.toString()).emit("channelCreate", channel)
})

module.exports = router