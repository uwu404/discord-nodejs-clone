const User = require("../../models/user")
const Image = require("../../models/image")
const sharp = require("sharp")
const resize = require("gif-resizer")
const sizeOf = require("image-size")
const Server = require("../../models/server")

function editavatar(app, io) {
    app.patch("/user/edit", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })


        const base64ex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/
        const base64str = req.body.data.split(",")[1]
        if (req.body.data && base64ex.test(base64str)) {

            const grabage = await Image.findOne({ name: `${user.avatarURL.split("/")[1]}` })
                .catch(err => console.log(err))

            const buffer = Buffer.from(base64str, "base64")
            const type = sizeOf(buffer).type

            if (type !== "gif") {
                const icon = sharp(buffer)
                icon.webp({ quality: 50 })
                icon.resize(300, 300)
                const data = await icon.toBuffer()
                await save(data, false)
            } else {
                const gif = await resize(buffer, { width: 300, height: 300, colors: 256, optimize: 1 })
                await save(gif, true)
            }


            async function save(data, dynamic) {
                const image = new Image({
                    data,
                    dynamic,
                })

                image.name = `${image._id}.webp`
                await image.save()
                user.avatarURL = `images/${image._id}.webp`
            }

            grabage?.delete()


        }
        if (req.body.username) user.username = req.body.username
        user.save()
            .then(async result => {
                res.send(result)
                const servers = await Server.find({ members: user._id })
                let rooms = io
                for (const server of servers) rooms = rooms.to(`${server._id}`)
                rooms.emit("memberUpdate", {
                    avatarURL: result.avatarURL,
                    username: result.username,
                    _id: result._id
                })
            })
    })
}

module.exports = editavatar