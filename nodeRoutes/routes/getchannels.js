const Channel = require("../../models/channel")

function getchannels(app) {
    app.get("/servers/:server/channels", async (req, res) => {
        const channels = await Channel.find({ server: req.params.server }).catch(err => console.log(err))
        res.send(channels)
    })
}

module.exports = getchannels