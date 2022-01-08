const Channel = require("../../models/channel")
const Server = require("../../models/server")
const User = require("../../models/user")

function createchannel(app, io) {
    app.post("/servers/:server/channels", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const server = await Server.findById(req.params.server)
        if (!server || !user) return res.status(403).send("// 403 forbidden")
        if (!req.body.name || req.body.name.length > 12) return res.status(403).send("// 403 forbidden")
        if (`${server.owner}` !== `${user._id}`) return res.status(403).send("// 403 forbidden") //only a server owner can create a channel
        const channel = await new Channel({
            name: req.body.name,
            server: server._id,
            type: "text"
        }).save()
        server.channels.push(channel._id)
        await server.save()
        res.send(channel)
        io.to(`${server._id}`).emit("channelCreate", channel)
    })
}

module.exports = createchannel