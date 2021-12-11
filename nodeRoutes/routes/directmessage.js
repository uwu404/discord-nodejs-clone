const User = require("../../models/user")
const Dms = require("../../models/dms")
const Server = require("../../models/server")
const Message = require("../../models/message")

function directMessage(app, io) {
    app.post("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const receiver = await User.findById(req.params.user)
        if (!receiver || !user || !req.body.content) return res.status(500).send("// something went wrong")
        const dm = await Dms.findOne({ users: { $all: [`${user._id}`, `${receiver._id}`] } })
        let invite = req.body.content?.match(/(^|\s)server\/.{7}(?=\s|$)/g)?.[0]
        const message = new Message({
            author: user._id,
            timestamp: Date.now(),
            content: req.body.content
        })
        if (invite) {
            const server = await Server.findOne({ invites: invite.split("/")[1] })
            if (server) message.invite = server._id
            invite = server
        }
        const msg = await message.save()
        if (!dm) {
            const newDm = new Dms({
                users: [`${user._id}`, `${receiver._id}`],
                messages: [`${msg._id}`]
            })
            await newDm.save()
        } else {
            dm.messages.push(`${msg._id}`)
            await dm.save()
        }
        await message.save()
        const _message = {
            invite,
            _id: msg._id,
            content: msg.content,
            attachment: {
                URL: null
            },
            timestamp: msg.timestamp,
            author: {
                avatarURL: user.avatarURL,
                username: user.username,
                tag: user.tag,
                _id: user._id,
                profileColor: user.profileColor
            },
            channel: user._id
        }
        res.send(_message)
        io.to(`${user._id}`).to(`${receiver._id}`).emit("dm", _message)
        receiver.notifications.push({
            type: "dm",
            id: `${user._id}`
        })
        await receiver.save()
        io.to(`${receiver._id}`).emit("notification", {
            type: "dm",
            id: user._id,
            user: {
                avatarURL: user.avatarURL,
                username: user.username,
                tag: user.tag,
                _id: user._id
            }
        })
    })
}

module.exports = directMessage