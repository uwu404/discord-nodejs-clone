const User = require("../../models/user")
const Dms = require("../../models/dms")
const Message = require("../../models/message")

function directMessage(app, io) {
    app.post("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const reciever = await User.findById(req.params.user)
        console.log(!!reciever, !!user, req.body.content)
        if (!reciever || !user || !req.body.content) return res.status(500).send("// something went wrong")
        const dm = await Dms.findOne({ users: { $all: [`${user._id}`, `${reciever._id}`] } })
        const message = new Message({
            author: user._id,
            timestamp: Date.now(),
            content: req.body.content
        })
        const msg = await message.save()
        if (!dm) {
            const newDm = new Dms({
                users: [`${user._id}`, `${reciever._id}`],
                messages: [`${msg._id}`]
            })
            await newDm.save()
        } else {
            dm.messages.push(`${msg._id}`)
            await dm.save()
        }
        await message.save()
        res.send(msg)
        io.to(`${user._id}`).to(`${reciever._id}`).emit("dm", {
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
                _id: user._id
            },
            channel: user._id
        })
    })
}

module.exports = directMessage