const Message = require("../../models/message")
const User = require("../../models/user")
const Channel = require("../../models/channel")

function sendMessage(app, io) {
    app.post("/channels/:channel/messages", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        const channel = await Channel.findOne({ _id: req.params.channel })
        if (!user || !channel) return res.status = 404
        const message = new Message({
            author: user._id,
            content: req.body.content,
            channel: req.params.channel,
            timestamp: Date.now()
        })
        message.save()
            .then(result => {
                res.send(result)
                io.to(`${channel._id}`).emit("message", result)
            })
    })
}

module.exports = sendMessage;