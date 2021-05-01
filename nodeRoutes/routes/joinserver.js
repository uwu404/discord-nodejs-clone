const User = require("../../models/user")
const Server = require("../../models/server")

function joinServer(app) {
    app.post("/servers/:server", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        const server = await Server.findOne({ invites: req.params.server })
        if (!user || !server) return res.status(500).send("error")
        server.invites.push(user._id)
        const result = await server.save()
        res.send(result)
    })
}

module.exports = joinServer