const User = require("../../models/user")
const Server = require("../../models/server")
const Channel = require("../../models/channel")

function getuser(app) {
    app.get("/user/password=:password&email=:email", async (req, res) => {
        const user = await User.findOne({ password: req.params.password, email: req.params.email }).catch(console.log)
        if (!user) res.status(500).send("oops something went wrong.")
        const servers = await Server.find({ members: user._id }).catch(console.log)
        const ids = Array.from(servers, s => s._id)
        const channels = await Channel.find({ server: { $in: ids } })
        const serversWithChannels = Array.from(servers, s => {
            const serverChannels = channels.filter(c => c.server === s._id)
            return Object.assign(s, { channels: serverChannels })
        })
        const USER = Object.assign(user, { servers: serversWithChannels })
        res.send(USER)
    })
}

module.exports = getuser;