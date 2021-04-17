const Server = require("../../models/server")
const User = require("../../models/user")
const Image = require("../../models/image")
const Channel = require("../../models/channel")
const sharp = require("sharp")

function createserver(app) {
    app.post("/servers", async (req, res) => {
        const token = req.headers.authorization
        if (!token) return res.status = 404
        const user = await User.findOne({ token: token }).catch(console.log)
        const server = new Server({
            owner: user._id,
            name: req.body.name,
            icon: "https://i1.sndcdn.com/avatars-000543806595-ivit9r-t500x500.jpg",
            members: [user._id],
            invites: [makeid(7)]
        })
        if (req.body.icon) {
            const icon = sharp(Buffer.from(req.body.icon.split(",")[1], "base64"))
            icon.webp()
            icon.resize(50, 50)
            const data = await icon.toBuffer()
            const image = new Image({
                data: data.toString("base64"),
                name: server._id + ".webp"
            })
            await image.save()
            server.icon = `${process.env.URL}/images/${server._id}.webp`
        }
        const channel = new Channel({
            server: server._id,
            name: "General",
            type: "text"
        })
        await channel.save()
        const result = await server.save()
        res.send(result)
    })
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = createserver