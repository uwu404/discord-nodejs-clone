const User = require("../../models/user")
const Dm = require("../../models/dms")

function getDmslogs(app) {
    app.get("/dms/logs", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        if (!user) return res.status(500).send("error")
        const dms = await Dm.find({ users: user._id })
        const usersId = Array.from(dms.users, d => d.find(u => u !== user._id))
        res.send(usersId)
    })
}

module.exports = getDmslogs