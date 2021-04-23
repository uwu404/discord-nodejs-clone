const Server = require("../../models/server");
const Channel = require("../../models/channel");
const User = require("../../models/user")
const Message = require("../../models/message");;

function deleteServer(app) {
    app.delete("/servers/:server", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        const server = await Server.findOne({ _id: req.params.server, owner: user._id })
        if (!user || !server) return res.status = 404
        const channels = await Channel.find({ server: server._id })
        const channelArray = Array.from(channels, c => c._id)
        await Message.deleteMany({ _id: { $in: channelArray } })
        await channels.delete()
        const result = await server.delete()
        res.send(result)
    })
}

module.exports = deleteServer