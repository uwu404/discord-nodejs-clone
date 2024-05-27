const Server = require("../../models/server")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const createImage = require("../../globalFunctions/createimage")
const crypto = require("node:crypto")
const express = require("express")
const { io } = require("../..")
const errors = require("../../globalFunctions/errors")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

const HOUR = 3.6e+6

router.post("/servers", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const error2 = errors.serverLimit
    if ((Date.now() - user.lastCreatedServer) < HOUR) return res.status(error2.status).send(error2.error)
    const base64str = req.body.icon?.split(",")[1]
    const icon = await createImage(base64str, { width: 200, height: 200, quality: 90 })

    user.lastCreatedServer = Date.now()
    await user.save()

    const server = new Server({
        owner: user._id,
        name: req.body.name,
        ...(icon && { icon: icon.URL }),
        members: [user._id],
        invites: [crypto.randomBytes(4).toString("hex")]
    })

    const textChannel = new Channel({ name: "General", type: "text", server: server._id })
    const voiceChannel = new Channel({ name: "mic-up", type: "voice", server: server._id })

    server.channels = [textChannel._id, voiceChannel._id]

    await textChannel.save()
    await voiceChannel.save()
    const result = await server.save()
    const newServer = Object.assign(result.toObject(), { channels: [textChannel, voiceChannel] })
    res.send(newServer)
    io.to(user._id.toString()).emit("serverJoin", newServer)
    const userSockets = Array.from(io.sockets.sockets)
        .filter(socket => socket[1].ultraId === user._id.toString())
        .map(socket => socket[1])
    userSockets.forEach(socket => socket.join(server._id.toString()))
})

module.exports = router