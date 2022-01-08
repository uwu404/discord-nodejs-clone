const User = require("../../models/user")
const Server = require("../../models/server")
const newAvatar = require("../../globalFunctions.js/createAvatar")
const createMember = require("../../globalFunctions.js/createMember")

const editavatar = (app, io) => {
    app.patch("/user/edit", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })

        const base64str = req.body.data.split(",")[1]
        
        User.findByIdAndUpdate(user._id, {
            username: req.body.username || user.username,
            avatarURL: await newAvatar(base64str, user, { width: 300, height: 300, quality: 80, lossy: false, optimize: 3 }), 
            profileColor: req.body.profileColor || user.profileColor
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