const User = require("../../models/user")
const Dm = require("../../models/dms")

function getDmslogs(app) {
    app.get("/dms/logs", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const dms = await Dm.find({ users: user._id })
        const usersId = Array.from(dms.users, d => d.find(u => u !== user._id))
        const users = await User.find({ _id: { $in: usersId } })
        const logs = Array.from(users, u => {
            return {
                username: u.username,
                avatarURL: u.avatarURL,
                _id: u._id,
                tag: u.tag
            }
        })
        res.send(logs)
    })
}

module.exports = getDmslogs