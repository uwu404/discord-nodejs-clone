const User = require("../../models/user")
const Dms = require("../../models/dms")
const Message = require("../../models/message")

function directMessage(app) {
    app.post("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const reciever = await User.findById(req.params.user)
        if (!reciever || !user || !req.body.content) res.status(500).send("// something went wrong")
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
        io.to(`${user._id}`).to(`${reciever._id}`).emit("dm")
    })
}

module.exports = directMessage