const createMessage = require("../../globalFunctions/createMessage")
const Message = require("../../models/message")
const express = require("express")
const router = express.Router()
const { io } = require("../../")

router.patch("/channels/:channel/messages/:message", async (req, res) => {
    if (!req.body.content.trim()) return
    const message = await Message.findOne({ _id: req.params.message }).populate("author")
    if (!message || message.author.token !== req.headers.authorization) return res.status(403).send({ error: "unvalid message id" })
    message.content = req.body.content.trim()
    await message.save()
    res.send(createMessage(message))
    io.to(req.params.channel).to(`${message.author._id}`).emit("messageEdit", Object.assign(createMessage(message), { dmFor: [req.params.channels, message.author._id] }))
})

module.exports = router