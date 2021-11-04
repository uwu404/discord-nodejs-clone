const Message = require("../../models/message")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const Server = require("../../models/server")
const mongoose = require("mongoose")

function getChannelMessages(app) {
    app.get("/channels/:channel/messages", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization }).catch(err => console.log(err))
        if (!mongoose.isValidObjectId(req.params.channel)) return res.status(403).send("// 403")
        const channel = await Channel.findById(req.params.channel)
        const server = await Server.findById(channel.server)
        if (!user || !channel || !server || (!server.members.includes(`${user._id}`))) return res.status(403).send("// 403")
        const messages = await Message.find({ channel: req.params.channel })
        const authors = Array.from(messages, m => m.author)
        const users = await User.find({ _id: { $in: authors } })
        const invites = Array.from(messages, m => m.invite)
        const servers = await Server.find({ _id: { $in: invites } })
        const mappedMessages = messages.map(m => {
            const user = users.find(u => u._id == m.author)
            const server = servers.find(s => s._id == m.invite)
            const message = {
                _id: m._id,
                content: m.content,
                timestamp: m.timestamp,
                channel: m.channel,
                attachment: {
                    width: m.attachment?.width,
                    height: m.attachment?.height,
                    URL: m.attachment?.URL
                },
                invite: server,
                author: { username: user.username, _id: user._id, avatarURL: user.avatarURL, tag: user.tag, online: user.online }
            }
            return message
        })
        res.send({ to: req.params.channel, messages: mappedMessages})
    })
}

module.exports = getChannelMessages
