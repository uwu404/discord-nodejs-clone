const Server = require("../../models/server")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const newAvatar = require("../../globalFunctions/createAvatar")
const crypto = require("node:crypto")

function createserver(app) {
    app.post("/servers", async (req, res) => {
        const token = req.headers.authorization
        if (!token) return res.status(500).send("// 500")
        const user = await User.findOne({ token: token }).catch(console.log)
        const base64str = req.body.icon?.split(",")[1]
        const icon = await newAvatar(base64str, { icon: null }, { width: 200, height: 200, quality: 90 })

        const channel = new Channel({
            name: "General",
            type: "text",
        })

        const server = new Server({
            owner: user._id,
            name: req.body.name,
            icon: icon.URL,
            members: [user._id],
            invites: [crypto.randomBytes(4).toString("hex")],
            channels: [channel._id],
        })

        channel.server = server._id

        await channel.save()
        const result = await server.save()
        res.send(Object.assign(JSON.parse(JSON.stringify(result)), { channels: [channel] }))
    })
}

module.exports = createserver