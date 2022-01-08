const User = require("../../models/user")
const Server = require("../../models/server")
const mongoose = require("mongoose")
const createMember = require("../../globalFunctions.js/createMember")

function getServerMembers(app) {
    app.get("/servers/:server/members", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        if (!mongoose.isValidObjectId(req.params.server)) return res.status(403)
        const server = await Server.findOne({ _id: req.params.server }).populate("members")
        if (!server || !user || !server.members.find(u => user._id.equals(u._id))) return res.status(500).send("something went wrong")
        const members = server.members.map(u => createMember(u))
        res.send(members)
    })
}

module.exports = getServerMembers