const Server = require("../../models/server")
const express = require("express")
const router = express.Router()

router.get("/servers/:invite", async (req, res) => {
    const server = await Server.findOne({ invites: req.params.invite })
    res.send(server)
})

module.exports = router