const User = require("../../models/user")
const Channel = require("../../models/channel")
const Server = require("../../models/server")
const mongoose = require("mongoose")
const { Socket } = require("socket.io")

/** @param {Socket} socket */
const join = socket => {
    socket.on("join", async (args) => {
        const user = await User.findById(socket.ultraId).catch(err => console.log(err))
        if (!mongoose.isValidObjectId(args.channel)) return
        const channel = await Channel.findById(args.channel)
        const server = await Server.findById(channel.server)
        if (!server.members.some(member => member.equals(user._id))) return
        socket.join(args.channel)
    })
}

module.exports = join