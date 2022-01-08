const Server = require("../../models/server")
const User = require("../../models/user")
const Channel = require("../../models/channel")
const newAvatar = require("../../globalFunctions.js/createAvatar")

function createserver(app) {
    app.post("/servers", async (req, res) => {
        const token = req.headers.authorization
        if (!token) return res.status(500).send("// 500")
        const user = await User.findOne({ token: token }).catch(console.log)
        const base64str = req.body.icon?.split(",")[1]

        const channel = new Channel({
            name: "General",
            type: "text",
        })

        const server = new Server({
            owner: user._id,
            name: req.body.name,
            icon: await newAvatar(base64str, { icon: "/tent.svg" }, { width: 200, height: 200, optimize: 1, colors: 256, quality: 100 }),
            members: [user._id],
            invites: [makeid(7)],
            channels: [channel._id],
        })

        channel.server = server._id

        await channel.save()
        const result = await server.save()
        res.send(Object.assign(JSON.parse(JSON.stringify(result)), { channels: [channel] }))
    })
}

function makeid(length) {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) result += characters[Math.floor(Math.random() * characters.length)];
    return result;
}

module.exports = createserver