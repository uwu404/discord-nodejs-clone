const Message = require("../../models/message")
const express = require("express")
const router = express.Router()
const emitMessage = require("../../globalFunctions/emitMessage")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const errors = require("../../globalFunctions/errors")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.patch("/channels/:channel/messages/:message", authenticateToken, async (req, res) => {
    if (!req.body.content.trim()) return
    const message = await Message.findOne({ _id: req.params.message }).populate("author")
    const user = await User.findById(req.user._id)
    const channel = await Channel.findById(message.channel) || await User.findById(message.channel)

    // checks
    const { invalidToken, invalidArgs, contentNotFound } = errors
    const sendError = (error) => res.status(error.status).send(error.error)
    if (!user) return sendError(invalidToken)
    if (!message) return sendError(contentNotFound)
    if (channel._id.toString() !== req.params.channel) sendError(invalidArgs)

    message.content = req.body.content.trim()
    await message.save()
    res.send(message.toObject())
    emitMessage(message, user, channel, "messageEdit")
})

module.exports = router