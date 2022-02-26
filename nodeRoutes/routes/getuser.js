const User = require("../../models/user")
const Server = require("../../models/server")
const createMember = require("../../globalFunctions/createMember")
const { scryptSync, timingSafeEqual } = require("crypto")

const getuser = app => {
    app.get("/user", async (req, res) => {
        const user = await User.findOne({ email: req.query.email }).catch(console.log)
        if (!user) return res.status(500).send({ error: "Invalid email or password" })
        const [salt, key] = user.password.split(":")
        const hashedBuffer = scryptSync(req.query.password, salt, 64)
        const keyBuffer = Buffer.from(key, "hex")
        const match = timingSafeEqual(keyBuffer, hashedBuffer)
        if (!match) return res.status(403).send({ error: "Invalid email or password" })
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