const User = require("../../models/user")
const Message = require("../../models/message")
const Channel = require("../../models/channel")
const Image = require("../../models/image")
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const { io } = require("../../")

router.delete("/channels/:channel/messages/:message", async (req, res) => {
    const user = await User.findOne({ token: req.headers.authorization })
    if (!mongoose.isValidObjectId(req.params.channel) || !mongoose.isValidObjectId(req.params.message)) return res.status(403).send("// 403")
    const channel = await Channel.findOne({ _id: req.params.channel }) ||
        await User.findById(req.params.channel)
    if (!user || !channel) return res.status(404)
    const message = await Message.findByIdAndDelete(req.params.message)
    if (!message) return
    await Image.deleteOne({ name: `${message.attachment.URL?.split("/")[1]}` })
    res.send(message)
    io.to(`${channel._id}`).to(`${user._id}`).emit("messageDelete", Object.assign(JSON.parse(JSON.stringify(message)), { user: channel._id }))
})

module.exports = router