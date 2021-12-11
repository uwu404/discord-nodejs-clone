const Server = require("../../models/server")
const User = require("../../models/user")
const Image = require("../../models/image")
const resize = require("gif-resizer")
const sizeOf = require("image-size")
const sharp = require("sharp")

function editServer(app, io) {
    app.patch("/server/:server", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const server = await Server.findById(req.params.server).catch(console.log)

        // handle errors
        if (!user) return res.status(401).send('// 401 unauthorized')
        if (!server) return res.status(404).send("// 404 not found")
        if (`${user._id}` !== server.owner) return res.status(403).send('// 403 forbidden')

        const base64ex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/
        const base64str = req.body.icon.split(",")[1]
        if (req.body.icon && base64ex.test(base64str)) {
            const grabage = await Image.findOne({ name: `${server.icon.split("/")[1]}` })

            const buffer = Buffer.from(base64str, "base64")
            const type = sizeOf(buffer).type

            if (type !== "gif") {
                const icon = sharp(buffer)
                icon.webp()
                icon.resize(100, 100)
                const data = await icon.toBuffer()
                await save(data, false)
            } else {
                const gif = await resize(buffer, { width: 100, height: 100, colors: 120, optimize: 3 })
                await save(gif, true)
            }

            async function save(data, dynamic) {
                const image = new Image({
                    data,
                    dynamic,
                })

                image.name = `${image._id}.webp`
                await image.save()
                server.icon = `images/${image._id}.webp`
            }

            grabage?.delete()
        }

        if (req.body.name) server.name = req.body.name
        await server.save()
        io.to(server._id + "").emit("serverUpdate", server)
    })
}

module.exports = editServer