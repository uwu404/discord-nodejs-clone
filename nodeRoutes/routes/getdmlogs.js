const User = require("../../models/user")
const Dm = require("../../models/dms")

function getDmslogs(app) {
    app.get("/dms/logs", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const dms = await Dm.find({ users: user._id })
        const usersId = Array.from(dms, d => d.users.find(u => u != user._id))
        const users = await User.find({ _id: { $in: usersId } })
        const list = await Dm.find({ users: `${user._id}` })
        const logs = Array.from(users, u => {
            return {
                username: u.username,
                avatarURL: u.avatarURL,
                _id: u._id,
                tag: u.tag,
                online: u.online
            }
        })
            .sort((a, b) => {
                const userA = list.find(dm => dm.users.includes(`${a._id}`))
                const userB = list.find(dm => dm.users.includes(`${b._id}`))
                const timestampA = new Date(userA.updatedAt || userA.createdAt)
                const timestampB = new Date(userB.updatedAt || userB.createdAt)
                return timestampB.getTime() - timestampA.getTime()
            })
        res.send(logs)
    })
}

module.exports = getDmslogs