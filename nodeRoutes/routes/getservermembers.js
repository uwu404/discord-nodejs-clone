const User = require("../../models/user")
const Server = require("../../models/server")
const mongoose = require("mongoose")

function getServerMembers(app) {
    app.get("/servers/:server/members", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        if (!mongoose.isValidObjectId(req.params.server)) return res.status(403)
        const server = await Server.findOne({ _id: req.params.server })
        if (!server || !user || !server.members.includes(user._id)) return res.status(500).send("something went wrong")
        const users = await User.find({ _id: { $in: server.members } })
        const members = Array.from(users, u => {
            return {
                username: u.username,
                online: u.online,
                _id: u._id,
                avatarURL: u.avatarURL,
                tag: u.tag
            }
        })
        res.send(members)
    })
}

module.exports = getServerMembers