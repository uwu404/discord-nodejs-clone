const User = require("../../models/user")
const Channel = require("../../models/channel")
const Server = require("../../models/server")
const mongoose = require("mongoose")

function join(socket) {
    socket.on("join", async args => {
        const user = await User.findOne({ token: args.Authorization }).catch(err => console.log(err))
        if (!mongoose.isValidObjectId(args.channel)) return
        const channel = await Channel.findById(args.channel)
        const server = await Server.findOne({ _id: channel?.server })
        if (!user || !channel || !server || (!server.members.includes(`${user._id}`))) return
        socket.join(args.channel)
    })
}

module.exports = join