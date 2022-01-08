const Server = require("../../models/server")
const User = require("../../models/user")
const newAvatar = require("../../globalFunctions.js/createAvatar")

const editServer = (app, io) => {
    app.patch("/server/:server", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const server = await Server.findById(req.params.server).catch(console.log)

        if (!user) return res.status(401).send('// 401 unauthorized')
        if (!server) return res.status(404).send("// 404 not found")
        if (!user._id.equals(server.owner)) return res.status(403).send('// 403 forbidden')

        const base64str = req.body.icon.split(",")[1]
        Server.findByIdAndUpdate(server._id, {
            name: req.body.name || server.name,
            icon: await newAvatar(base64str, server, { width: 200, height: 200, optimize: 1, colors: 256, quality: 100 })
        }, { new: true })
            .then(result => {
                io.to(server._id + "").emit("serverUpdate", result)
            })
    })
}

module.exports = editServer