const User = require("../../models/user")
const Dms = require("../../models/dms")
const Server = require("../../models/server")
const Message = require("../../models/message")
const createMember = require("../../globalFunctions.js/createMember")
const createMessage = require("../../globalFunctions.js/createMessage")

function directMessage(app, io) {
    app.post("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const receiver = await User.findById(req.params.user)
        if (!receiver || !user || !req.body.content) return res.status(500).send("// something went wrong")
        const message = new Message({
            author: user._id,
            timestamp: Date.now(),
            content: req.body.content
        })
        const dm = await Dms.findOne({ users: { $all: [user._id, receiver._id] } }) || new Dms({ users: [user._id, receiver._id] })
        let invite = req.body.content?.match(/(^|\s)server\/.{7}(?=\s|$)/g)?.[0]
        if (invite) {
            const server = await Server.findOne({ invites: invite.split("/")[1] })
            if (server) message.invite = server._id
            invite = server
        }
        dm.messages.push(message._id)
        await dm.save()
        const msg = await message.save()
        res.send(createMessage(msg))
        io.to(`${user._id}`).to(`${receiver._id}`).emit("dm", createMessage(msg))
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