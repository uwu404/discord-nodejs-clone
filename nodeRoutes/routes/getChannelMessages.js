const Message = require("../../models/message")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const Server = require("../../models/server")
const mongoose = require("mongoose")
const express = require("express")
const createMember = require("../../globalFunctions/createmember")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

router.get("/channels/:channel/messages", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id).catch(err => console.log(err))
    if (!mongoose.isValidObjectId(req.params.channel)) return res.status(403).send("// 403")
    const channel = await Channel.findById(req.params.channel)
    const server = await Server.findOne({ _id: channel?.server })
    if (!user || !channel || !server || (!server.members.includes(`${user._id}`))) return res.status(403).send("// 403")
    const messages = await Message.find({ channel: req.params.channel })
        .populate([{ path: "invite" }, { path: "author" }])
    const mappedMessages = messages.map(m => ({ ...m.toObject(), author: createMember(m.author) }))
    res.send(mappedMessages)
})

module.exports = router
