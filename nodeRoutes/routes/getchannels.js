const Channel = require("../../models/channel")
const express = require("express")
const router = express.Router()

router.get("/servers/:server/channels", async (req, res) => {
    const channels = await Channel.find({ server: req.params.server }).catch(err => console.log(err))
    res.send(channels)
})

module.exports = router