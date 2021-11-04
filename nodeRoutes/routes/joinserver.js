const User = require("../../models/user")
const Server = require("../../models/server")
const Channel = require("../../models/channel")

function joinServer(app) {
    app.post("/servers/:server", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        const server = await Server.findOne({ invites: req.params.server })
        if (!user || !server) return res.status(500).send("error")
        if (!server.members.includes(user._id)) server.members.push(user._id)
        const result = await server.save()
        const channels = await Channel.find({ server: server._id })
        res.send(Object.assign(JSON.parse(JSON.stringify(result)), { channels }))
    })
}

module.exports = joinServer