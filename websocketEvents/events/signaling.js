const mongoose = require("mongoose")
const socketio = require("socket.io")
const Channel = require("../../models/channel")
const Server = require("../../models/server")
const User = require("../../models/user")

/** @param {socketio.Socket} socket @param {socketio.Server} io */
const joinVC = (socket, io) => {
    const createMember = (user) => {
        const isOnline = io.sockets.adapter.rooms.get(user._id.toString())?.size
        return { ...user.toObject(), password: null, email: null, friends: null, status: isOnline ? user.status : "offline" }
    }
    socket.on("joinvc", async (c) => {
        const user = await User.findById(socket.ultraId)
        if (!mongoose.isValidObjectId(c)) return
        const channel = await Channel.findById(c)
        const server = await Server.findById(channel.server)
        if (!server.members.includes(user._id)) return
        // find all sockets connected to this room/channel
        const connectedSockets = await io.in(channel._id.toString()).fetchSockets()
        // if this user is connected in another tab/window return (no duplicate connections)
        if (connectedSockets.some(socket => socket.ultraId === user._id.toString())) return
        socket.join(channel._id.toString())
        io.to(server._id.toString()).emit("joinvc", createMember(user), channel.toObject())
        socket.once("disconnect", () => io.to(server._id.toString()).emit("leavevc", createMember(user), channel.toObject()))
    })
    socket.on("leavevc", async (channelId) => {
        const user = await User.findById(socket.ultraId)
        if (!mongoose.isValidObjectId(channelId)) return
        const channel = await Channel.findById(channelId)
        const server = await Server.findById(channel.server)
        socket.leave(channelId)
        io.to(server._id.toString()).emit("leavevc", createMember(user), channel.toObject())
    })
    socket.on("offer", (offer, user, to) => {
        io.to(to).emit("offer", offer, user)
    })
    socket.on("answer", (answer, user, to) => {
        io.to(to).emit("answer", answer, user)
    })
    socket.on("candidate", (candidate, user, to) => {
        io.to(to).emit("candidate", candidate, user)
    })
}

module.exports = joinVC