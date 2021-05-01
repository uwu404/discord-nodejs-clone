const User = require("../../models/user")
const Message = require("../../models/channel")
const Dms = require("../../models/dms")

function getDirectMessages(app) {
    app.get("/dm/:user", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const reciever = await User.findById(req.params.user)
        const dm = await Dms.findOne({ users: { $all: [`${user._id}`, `${reciever._id}`] } })
        res.send(dm)
    })
}

module.exports = getDirectMessages