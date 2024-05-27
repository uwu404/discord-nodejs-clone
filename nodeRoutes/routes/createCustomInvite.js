const Server = require("../../models/server")
const User = require("../../models/user")
const express = require("express")
const errors = require("../../globalFunctions/errors")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

// creates a custom invite link for a server
router.post("/servers/:server/invites", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const server = await Server.findById(req.params.server)
    const invite = req.body.invite

    const { invalidToken, invalidArgs, alreadyInUse } = errors
    if (!user) return res.status(invalidToken.status).send(invalidToken.error)
    if (!server || invite?.length > 20) return res.status(invalidArgs.status).send(invalidArgs.error)
    // if the invite link is already in use
    if (await Server.findOne({ invites: invite })) return res.status(alreadyInUse.status).send(alreadyInUse.error)

    server.invites.push(invite)
    const result = await server.save()
    res.send(result)
})

module.exports = router