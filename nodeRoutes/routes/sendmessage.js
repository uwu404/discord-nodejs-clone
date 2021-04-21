const Message = require("../../models/message")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const Image = require("../../models/image")
const sharp = require("sharp")

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
        if (req.body.attachment) {
            const buffer = Buffer.from(req.body.attachment.data.split(",")[1], "base64")
            // still no gif support
            const data = await sharp(buffer).webp({ quality: 60 }).toBuffer()
            const image = new Image({
                data: data.toString("base64"),
                name: `${message._id}.webp`
            })
            await image.save()
            message.attachment = {
                width: req.body.attachment.width,
                height: req.body.attachment.height,
                URL: `${process.env.URL}/images/${message._id}.webp`
            }
        }
        message.save()
            .then(result => {
                res.send(result)
                io.to(`${channel._id}`).emit("message", result)
            })
    })
}

module.exports = sendMessage;