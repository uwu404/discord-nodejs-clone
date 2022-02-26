const Message = require("../../models/message")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const Server = require("../../models/server")
const mongoose = require("mongoose")
const createMessage = require("../../globalFunctions/createMessage")
const newAvatar = require("../../globalFunctions/createAvatar")

function sendMessage(app, io) {
    app.post("/channels/:channel/messages", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        if (!mongoose.isValidObjectId(req.params.channel)) return res.status(403).send("// 403")
        const channel = await Channel.findById(req.params.channel)
        if (!user || !channel || (!req.body.content?.trim() && !req.body.attachment)) return res.status(500).send("// cannot send an empty message")
        let invite = req.body.content?.match(/(^|\s)server\/.{7}(?=\s|$)/g)?.[0]
        const base64str = req.body.attachment?.split(",")[1]
        const attachment = await newAvatar(base64str, { attachment: true }, { quality: 60 })
        const message = new Message({
            author: user._id,
            content: req.body.content?.trim(),
            channel: req.params.channel,
            timestamp: Date.now(),
            attachment
        })
        if (invite) {
            const server = await Server.findOne({ invites: invite.split("/")[1] })
            if (server) message.invite = server._id
            invite = server
        }

        message.save()
            .then(result => {
                const msg = Object.assign(createMessage(result, user), { invite })
                res.send(msg)
                io.to(`${channel._id}`).emit("message", msg)
            })
    })
}

module.exports = sendMessage;