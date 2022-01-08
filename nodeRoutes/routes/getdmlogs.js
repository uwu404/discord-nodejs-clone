const User = require("../../models/user")
const Dm = require("../../models/dms")
const createMember = require("../../globalFunctions.js/createMember")

const getDmslogs = app => {
    app.get("/dms/logs", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const dms = await Dm.find({ users: user._id })
            .populate("users")
        const logs = dms.sort((a, b) => {
            const timestampA = new Date(a.updatedAt || a.createdAt)
            const timestampB = new Date(b.updatedAt || b.createdAt)
            return timestampB.getTime() - timestampA.getTime()
        })
            .map(dm => [createMember(dm.users[0]), createMember(dm.users[1])]).flat(1)
            .filter(u => !user._id.equals(u._id))
        res.send(logs)
    })
}

module.exports = getDmslogs