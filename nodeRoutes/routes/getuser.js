const User = require("../../models/user")
const Server = require("../../models/server")
const createMember = require("../../globalFunctions.js/createMember")

function getuser(app) {
    app.get("/user", async (req, res) => {
        const user = await User.findOne({ password: req.query.password, email: req.query.email }).catch(console.log)
        if (!user) return res.status(500).send("oops something went wrong.")
        const servers = await Server.find({ members: user._id }).populate("channels")
        const dms = Array.from(user.notifications, (notification) => notification.type === "dm" && notification.id)
        const users = await User.find({ _id: { $in: dms } })
        const mappedusers = users.map(u => ({
            user: createMember(u), 
            type: "dm",
            id: u._id
        }))
        const notifications = dms.map(n => mappedusers.find(u => u.id == n))
        const USER = Object.assign(JSON.parse(JSON.stringify(user)), { servers, notifications })
        res.send(USER)
    })
}

module.exports = getuser;