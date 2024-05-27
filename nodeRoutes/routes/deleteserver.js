const Server = require("../../models/server")
const Channel = require("../../models/channel")
const User = require("../../models/user")
const Message = require("../../models/message")
const express = require("express")
const Image = require("../../models/image")
const { io } = require("../..")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

router.delete("/servers/:server", authenticateToken, async (req, res) => {
    const token = req.headers.authorization
    const user = await User.findById(req.user._id)
    const server = await Server.findOne({ _id: req.params.server, owner: user._id })
    if (!user || !server) return res.status(500).send("oops something went wrong 😂👌!1!1!!")
    if (!server.owner.equals(user._id)) return res.status(403).send("// 403 forbidden ")
    const channels = await Channel.find({ server: server._id })
    const channelArray = Array.from(channels, c => c._id)
    const messages = await Message.find({ channel: { $in: channelArray } })
    for (const message of messages) {
        for (const attachment of message.attachments) {
            await Image.deleteOne({ name: `${attachment.URL?.split("/")[1]}` })
        }
        message.delete()
    }
    channels.forEach(channel => channel.delete())
    const result = await server.delete()
    res.send(result)
    io.to(server._id.toString()).emit("leave", server.toObject())
})

module.exports = router