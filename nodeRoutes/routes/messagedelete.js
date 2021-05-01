const User = require("../../models/user")
const Message = require("../../models/message")
const Channel = require("../../models/channel")
const Image = require("../../models/image")

function deleteMessage(app, io) {
    app.delete("/channels/:channel/messages/:message", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const channel = await Channel.findOne({ _id: req.params.channel }) || await User.findOne({ _id: req.params.channel })
        if (!user || !channel) return res.status = 404
        const message = await Message.findByIdAndDelete(req.params.message)
        await Image.findOneAndDelete({ name: `${message._id}.webp` })
        res.send(message)
        io.to(`${channel._id}`).emit("messageDelete", message)
    })
}

module.exports = deleteMessage