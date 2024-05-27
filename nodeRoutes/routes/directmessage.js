const User = require("../../models/user")
const Dms = require("../../models/dms")
const Message = require("../../models/message")
const createMember = require("../../globalFunctions/createmember")
const createImage = require("../../globalFunctions/createimage")
const express = require("express")
const router = express.Router()
const { io } = require("../../")
const mongoose = require("mongoose")
const getServer = require("../../globalFunctions/getServer")
const errors = require("../../globalFunctions/errors")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.post("/dm/:user", authenticateToken, async (req, res) => {
    const { userNotFound, contentNotFound, invalidArgs } = errors
    const user = await User.findById(req.user._id)
    if (!mongoose.isValidObjectId(req.params.user)) return invalidArgs.send(res)
    if (!req.body.content?.trim() && !req.body.attachments) return invalidArgs.send(res)
    const receiver = await User.findById(req.params.user)
    if (!receiver) return contentNotFound.send(res)
    if (!user) return userNotFound.send(res)
    const base64array = req.body.attachments?.map(att => att.split(",")[1]) || []
    const attachments = await Promise.all(base64array?.map(async base64str => await createImage(base64str, { quality: 60 })))
    for (let i = attachments.length - 1; i >= 0; i--) {
        if (!attachments[i]) attachments.splice(i, 1)
    }

    const message = new Message({
        author: user._id,
        timestamp: Date.now(),
        content: req.body.content?.trim(),
        channel: receiver._id.toString(),
        invite: await getServer(req.body.content),
        attachments
    })

    const dm = await Dms.findOne({ users: { $all: [user._id, receiver._id] } }) || new Dms({ users: [user._id, receiver._id] })
    dm.messages.push(message._id)
    await dm.save()

    await message.save()
    const createdMessage = await Message.populate(message, [{ path: "author" }, { path: "invite" }])
    const filterMessage = { ...createdMessage.toObject(), author: createMember(createdMessage.author) }
    res.send(filterMessage)
    io.to(user._id.toString()).emit("dm", filterMessage)
    io.to(receiver._id.toString()).emit("dm", { ...filterMessage, channel: user._id })
    receiver.notifications.push({ type: "dm", id: user._id.toString() })
    await receiver.save()
    io.to(receiver._id.toString()).emit("notification", {
        type: "dm",
        id: user._id,
        user: createMember(user)
    })
})

module.exports = router