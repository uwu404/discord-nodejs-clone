const Message = require("../../models/message")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const Image = require("../../models/image")
const Server = require("../../models/server")
const sharp = require("sharp")
const sizeOf = require("image-size")
const gifResize = require("gif-resizer")

function sendMessage(app, io) {
    app.post("/channels/:channel/messages", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        const channel = await Channel.findOne({ _id: req.params.channel })
        if (!user || !channel || (!req.body.content && !req.body.attachment)) return res.status(500).send("// cannot send an empty message")
        const invite = req.body.content?.match(/(^|\s)server\/.{7}(?=\s|$)/g)?.[0]
        const message = new Message({
            author: user._id,
            content: req.body.content,
            channel: req.params.channel,
            timestamp: Date.now()
        })
        if (invite) {
            const server = await Server.findOne({ invites: invite.split("/")[1] })
            if (server) message.invite = { code: invite.split("/")[1], icon: server.icon, name: server.name, members: server.members.length }
        }


        const base64str = req.body.attachment?.split(",")[1]
        const base64ex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/
        if (!req.body.content && !base64ex.test(base64str)) return res.status(500).send("// cannot send an empty message")
        if (base64str && base64ex.test(base64str)) {
            const buffer = Buffer.from(base64str, "base64")
            const size = sizeOf(buffer)

            if (size.type !== "gif") {
                const data = await sharp(buffer).webp({ quality: 60 }).toBuffer()
                await save(data, false)
            } else {
                const gif = await gifResize(buffer, { lossy: 90, optimize: 3, colors: 150 })
                await save(gif, true)
            }

            async function save(data, dynamic) {
                const image = new Image({
                    data,
                    dynamic,
                })

                image.name = `${image._id}.webp`
                await image.save()

                message.attachment = {
                    width: size.width,
                    height: size.height,
                    URL: `images/${image._id}.webp`
                }
            }
        }
        message.save()
            .then(result => {
                res.send(result)
                io.to(`${channel._id}`).emit("message", {
                    _id: result._id,
                    content: result.content,
                    timestamp: result.timestamp,
                    channel: result.channel,
                    attachment: {
                        width: result.attachment?.width,
                        height: result.attachment?.height,
                        URL: result.attachment?.URL
                    },
                    author: { username: user.username, _id: user._id, avatarURL: user.avatarURL, tag: user.tag }
                })
            })
    })
}

module.exports = sendMessage;