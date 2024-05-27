const authenticateToken = require("../../globalFunctions/authenticateToken")
const Server = require("../../models/server")
const express = require("express")
const router = express.Router()

// this file is not used by the app
router.get("/servers/:invite", authenticateToken, async (req, res) => {
    const server = await Server.findOne({ invites: req.params.invite })
        .populate('members')
    res.send(server.toObject())
})

module.exports = router