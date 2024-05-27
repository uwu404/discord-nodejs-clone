const Message = require("../../models/message")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const mongoose = require("mongoose")
const createImage = require("../../globalFunctions/createimage")
const express = require("express")
const router = express.Router()
const getServer = require("../../globalFunctions/getServer")
const { io } = require("../../")
const createMember = require("../../globalFunctions/createmember")
const errors = require("../../globalFunctions/errors")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.post("/channels/:channel/messages", authenticateToken, async (req, res) => {
    const token = req.headers.authorization
    const user = await User.findById(req.user._id)
    const { invalidArgs, invalidToken } = errors
    if (!mongoose.isValidObjectId(req.params.channel)) return res.status(invalidArgs.status).send(invalidArgs.error)
    const channel = await Channel.findById(req.params.channel)
    if (!user) return res.status(invalidToken.status).send(invalidToken.error)
    if (!channel || (!req.body.content?.trim() && !req.body.attachments?.length)) return res.status(invalidArgs.status).send(invalidArgs.error)
    const base64array = req.body.attachments?.map(att => att.split(",")[1])
    const attachments = await Promise.all(base64array.map(async base64str => await createImage(base64str, { quality: 60 }))) || []
    for (let i = attachments.length - 1; i >= 0; i--) {
        if (!attachments[i]) attachments.splice(i, 1)
    }

    const message = new Message({
        author: user._id,
        content: req.body.content?.trim(),
        channel: req.params.channel,
        timestamp: Date.now(),
        invite: await getServer(req.body.content),
        attachments
    })

    await message.save()
    const createdMessage = await Message.populate(message, [{ path: "invite" }, { path: "author" }])
    const filterMessage = { ...createdMessage.toObject(), author: createMember(createdMessage.author) }
    res.send(filterMessage)
    io.to(channel._id.toString()).emit("message", filterMessage)
})

module.exports = router