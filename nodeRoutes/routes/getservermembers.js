const User = require("../../models/user")
const Server = require("../../models/server")

function getServerMembers(app) {
    app.get("/servers/:server/members", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const server = await Server.findOne({ _id: req.params.server })
        if (!server || !user || !server.members.includes(user._id)) return res.status(500).send("something went wrong")
        const users = await User.find({ _id: { $in: server.members } })
        const members = Array.from(users, u => {
            return {
                username: u.username,
                presence: u.presence,
                _id: u._id,
                avatarURL: u.avatarURL,
                tag: u.tag
            }
        })
        res.send(members)
    })
}

module.exports = getServerMembers