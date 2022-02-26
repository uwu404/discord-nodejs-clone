const User = require("../../models/user")
const Server = require("../../models/server")
const createImage = require("../../globalFunctions/createAvatar")
const createMember = require("../../globalFunctions/createMember")

const editavatar = (app, io) => {
    app.patch("/user/edit", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })

        const base64str = req.body.data?.split(",")[1]

        const av = await createImage(base64str, { width: 512, height: 512, quality: 90 })
        User.findByIdAndUpdate(user._id, {
            username: req.body.username || user.username,
            ...(!!av && { avatarURL: av.URL }),
            profileColor: req.body.profileColor || user.profileColor,
        }, { new: true })
            .then(async result => {
                res.send(result)
                const servers = await Server.find({ members: user._id })
                let rooms = io
                for (const server of servers) rooms = rooms.to(`${server._id}`)
                for (const friend of user.friends) rooms = rooms.to(friend)
                rooms.emit("memberUpdate", createMember(result))
            })
    })
}

module.exports = editavatar