const User = require("../../models/user")
const Message = require("../../models/message")
const Channel = require("../../models/channel")
const Image = require("../../models/image")
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const emitMessage = require("../../globalFunctions/emitMessage")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.delete("/channels/:channel/messages/:message", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!mongoose.isValidObjectId(req.params.channel) || !mongoose.isValidObjectId(req.params.message)) return res.status(403).send("// 403")
    const channel = await Channel.findOne({ _id: req.params.channel }) ||
        await User.findById(req.params.channel)
    if (!user || !channel) return res.status(404)
    if (channel._id.toString() == user._id.toString()) return res.status(404)
    const message = await Message.findByIdAndDelete(req.params.message).populate("author")
    if (!message) return
    message.attachments?.forEach(async attachment => await Image.deleteOne({ name: `${attachment.URL?.split("/")[1]}` }))
    res.send(message)
    emitMessage(message, user, channel, "messageDelete")
})

module.exports = router