const User = require("../../models/user")
const Dms = require("../../models/dms")
const Server = require("../../models/server")
const Message = require("../../models/message")
const createMember = require("../../globalFunctions/createMember")
const createMessage = require("../../globalFunctions/createMessage")
const newAvatar = require("../../globalFunctions/createAvatar")

function directMessage(app, io) {
    app.post("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const receiver = await User.findById(req.params.user)
        if (!receiver || !user || (!req.body.content?.trim() && !req.body.attachment)) return res.status(500).send("// something went wrong")
        const base64str = req.body.attachment?.split(",")[1]
        const attachment = await newAvatar(base64str, { attachment: true }, { quality: 60 })
        const message = new Message({
            author: user._id,
            timestamp: Date.now(),
            content: req.body.content,
            attachment
        })
        const dm = await Dms.findOne({ users: { $all: [user._id, receiver._id] } }) || new Dms({ users: [user._id, receiver._id] })
        let invite = req.body.content?.match(/(^|\s)server\/.{8}(?=\s|$)/g)?.[0]
        if (invite) {
            const server = await Server.findOne({ invites: invite.split("/")[1] })
            if (server) message.invite = server._id
            invite = server
        }
        dm.messages.push(message._id)
        await dm.save()
        const msg = await message.save()
        res.send(Object.assign(createMessage(msg), { invite }))
        io.to(`${user._id}`).to(`${receiver._id}`).emit("dm", Object.assign(createMessage(msg, user), { invite, dmFor: [receiver._id, user._id] }))
        receiver.notifications.push({
            type: "dm",
            id: `${user._id}`
        })
        await receiver.save()
        io.to(`${receiver._id}`).emit("notification", {
            type: "dm",
            id: user._id,
            user: createMember(user)
        })
    })
}

module.exports = directMessage