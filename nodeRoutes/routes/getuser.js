const User = require("../../models/user")
const Server = require("../../models/server")
const Channel = require("../../models/channel")

function getuser(app) {
    app.get("/user", async (req, res) => {
        const user = await User.findOne({ password: req.query.password, email: req.query.email }).catch(console.log)
        if (!user) return res.status(500).send("oops something went wrong.")
        const servers = await Server.find({ members: user._id }).catch(console.log)
        const ids = Array.from(servers, s => s._id)
        const channels = await Channel.find({ server: { $in: ids } })
        const serversWithChannels = Array.from(servers.reverse(), s => {
            const serverChannels = channels.filter(c => c.server == s._id)
            return Object.assign(JSON.parse(JSON.stringify(s)), { channels: serverChannels })
        })
        const dms = Array.from(user.notifications, (notification) => notification.type === "dm" && notification.id)
        const users = await User.find({ _id: { $in: dms } })
        const mappedusers = users.map(u => ({
            user: {
                avatarURL: u.avatarURL,
                username: u.username,
                tag: u.tag,
                _id: u._id
            },
            type: "dm",
            id: u._id
        }))
        const notifications = dms.map(n => mappedusers.find(u => u.id == n))
        const USER = Object.assign(JSON.parse(JSON.stringify(user)), { servers: serversWithChannels, notifications })
        res.send(USER)
    })
}

module.exports = getuser;