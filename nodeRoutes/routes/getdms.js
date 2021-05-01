const User = require("../../models/user")
const Message = require("../../models/message")
const Dms = require("../../models/dms")

function getDirectMessages(app) {
    app.get("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const reciever = await User.findById(req.params.user)
        if (!user || !reciever) return res.status(500).send("oops something went wrong")
        const dm = await Dms.findOne({ users: { $all: [`${user._id}`, `${reciever._id}`] } })
        const messages = await Message.find({ _id: { $in: dm.messages } })
        const result = messages.map(m => {
            const author = m.author === `${user._id}` ? user : reciever
            const message = {
                _id: m._id,
                content: m.content,
                timestamp: m.timestamp,
                author: { username: author.username, _id: author._id, avatarURL: author.avatarURL, tag: author.tag }
            }
            return message
        })
        res.send(result)
    })
}

module.exports = getDirectMessages