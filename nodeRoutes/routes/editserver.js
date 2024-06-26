const Server = require("../../models/server")
const User = require("../../models/user")
const createImage = require("../../globalFunctions/createimage")
const express = require("express")
const router = express.Router()
const { io } = require("../../")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.patch("/servers/:server", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const server = await Server.findById(req.params.server).catch(console.log)

    if (!user) return res.status(401).send('// 401 unauthorized')
    if (!server) return res.status(404).send("// 404 not found")
    if (!user._id.equals(server.owner)) return res.status(403).send('// 403 forbidden')

    const base64str = req.body.icon?.split(",")[1]
    const newIcon = await createImage(base64str, { width: 200, height: 200, quality: 90 })
    Server.findByIdAndUpdate(server._id, {
        name: req.body.name || server.name,
        ...(newIcon && { icon: newIcon.URL })
    }, { new: true })
        .then(result => {
            res.send(result.toObject())
            io.to(server._id + "").emit("serverUpdate", result.toObject())
        })
})

module.exports = router