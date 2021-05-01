const User = require("../../models/user")
const Message = require("../../models/channel")
const Dms = require("../../models/dms")

function getDirectMessages(app) {
    app.get("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const reciever = await User.findById(req.params.user)
        if (!user || !reciever) return res.status(500).send("oops something went wrong")
        const dm = await Dms.findOne({ users: { $all: [`${user._id}`, `${reciever._id}`] } })
        const list = dm.messages
        const messages = await Message.find({ _id: { $in: list } })
        res.send(messages)
    })
}

module.exports = getDirectMessages