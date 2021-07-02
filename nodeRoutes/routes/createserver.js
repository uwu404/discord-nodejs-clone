const Server = require("../../models/server")
const User = require("../../models/user")
const Image = require("../../models/image")
const Channel = require("../../models/channel")
const sharp = require("sharp")
const sizeOf = require("image-size")
const resize = require("gif-resizer")

function createserver(app) {
    app.post("/servers", async (req, res) => {
        const token = req.headers.authorization
        if (!token) return res.status(500).send("// 500")
        const user = await User.findOne({ token: token }).catch(console.log)
        const server = new Server({
            owner: user._id,
            name: req.body.name,
            icon: "piano.svg",
            members: [user._id],
            invites: [makeid(7)]
        })

        // creating an icon for the server
        if (req.body.icon) {
            const buffer = Buffer.from(req.body.icon.split(",")[1], "base64")
            const type = sizeOf(buffer).type


            if (type !== "gif") {
                const icon = sharp(buffer)
                icon.webp()
                icon.resize(100, 100)
                const data = await icon.toBuffer()
                save(data, false)
            } else {
                // if the image is a gif
                const gif = await resize(buffer, { width: 100, height: 100, colors: 120, optimize: 3 })
                await save(gif, true)
            }
            async function save(data, dynamic) {
                const image = new Image({
                    data,
                    dynamic
                })
                image.name = image._id + `.${type}`
                await image.save()
                server.icon = `images/${image._id}.${type}`
            }
        }

        const channel = new Channel({
            server: server._id,
            name: "General",
            type: "text"
        })
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