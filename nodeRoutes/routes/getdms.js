const User = require("../../models/user")
const Dms = require("../../models/dms")
const mongoose = require("mongoose")
const createMessage = require("../../globalFunctions.js/createMessage")

function getDirectMessages(app) {
    app.get("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        if (!mongoose.isValidObjectId(req.params.user)) return res.status(500).send("oops something went wrong")
        const reciever = await User.findById(req.params.user)
        if (!user || !reciever) return res.status(500).send("oops something went wrong")
        const dm = await Dms.findOne({ users: { $all: [user._id, reciever._id] } })
            .populate({
                path: "messages",
                populate: [{ path: "author" }, { path: "invite" }]
            }) || new Dms({
                users: [user._id, reciever._id],
                messages: []
            })
        const result = dm.messages.map(createMessage)
        res.send(result)
    })
}

module.exports = getDirectMessages