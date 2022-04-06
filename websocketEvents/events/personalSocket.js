const User = require("../../models/user")
const Server = require("../../models/server")

const collect = (io, servers, friends, socket) => {
    let rooms = io
    for (const friend of friends) rooms = rooms.to(`${friend}`)
    for (const server of servers) { 
        socket.join(`${server._id}`)
        rooms = rooms.to(`${server._id}`)
    }
    return rooms
}

function personalSocket(socket, io) {
    socket.on("online", async token => {
        const user = await User.findOne({ token })
        const servers = await Server.find({ members: user._id })
        const rooms = collect(io, servers, user.friends, socket)
        user.online = true
        socket.join(`${user._id}`)
        rooms.emit("online", { user: user._id, online: true })
        await user.save()
        socket.on("disconnect", async () => {
            const user = await User.findOne({ token })
            const servers = await Server.find({ members: user._id })
            const rooms = collect(io, servers, user.friends, socket)
            const sockets = io.sockets.adapter.rooms.get(`${user._id}`)?.size
            if (sockets) return
            user.online = false
            rooms.emit("online", { user: user._id, online: false })
            await user.save() 
        })
    })
}

module.exports = personalSocket
