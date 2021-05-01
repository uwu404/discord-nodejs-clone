const Server = require("../../models/server")

function getServer(app) {
    app.get("/servers/:invite", async (req, res) => {
        const server = await Server.findOne({ invites: req.params.invite })
        res.send(server)
    })
}

module.exports = getServer