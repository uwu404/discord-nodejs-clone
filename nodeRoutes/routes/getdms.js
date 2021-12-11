const User = require("../../models/user")
const Message = require("../../models/message")
const Dms = require("../../models/dms")
const mongoose = require("mongoose")
const Server = require("../../models/server")

function getDirectMessages(app) {
    app.get("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        if (!mongoose.isValidObjectId(req.params.user)) return res.status(500).send("oops something went wrong")
        const reciever = await User.findById(req.params.user)
        if (!user || !reciever) return res.status(500).send("oops something went wrong")
        const dm = await Dms.findOne({ users: { $all: [`${user._id}`, `${reciever._id}`] } }) ||
            new Dms({
                users: [`${user._id}`, `${reciever._id}`],
                messages: []
            })
        const messages = await Message.find({ _id: { $in: dm.messages } })
        const invites = Array.from(messages, m => m.invite)
        const servers = await Server.find({ _id: { $in: invites } })
        const result = messages.map(m => {
            const author = m.author === `${user._id}` ? user : reciever
            const server = servers.find(s => s._id == m.invite)
            const message = {
                invite: server,
                channel: reciever._id,
                _id: m._id,
                content: m.content,
                timestamp: m.timestamp,
                author: { username: author.username, _id: author._id, avatarURL: author.avatarURL, tag: author.tag, profileColor: author.profileColor }
            }
            return message
        })
        res.send(result)
    })
}

module.exports = getDirectMessages