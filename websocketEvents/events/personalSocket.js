const User = require("../../models/user")
const Server = require("../../models/server")

function personalSocket(socket, io) {
    socket.on("online", async token => {
        const user = await User.findOne({ token })
        const servers = await Server.find({ members: user._id })
        let rooms = io
        for (const friend of user.friends) rooms = rooms.to(`${friend}`)
        for (const server of servers) { 
            socket.join(`${server._id}`)
            rooms = rooms.to(`${server._id}`)
        }
        user.online = true
        socket.join(`${user._id}`)
        rooms.emit("online", { user: user._id, online: true })
        await user.save()
        socket.on("disconnect", async () => {
            const sockets = io.sockets.adapter.rooms.get(`${user._id}`)?.size
            if (sockets) return
            user.online = false
            rooms.emit("online", { user: user._id, online: false })
            user.save()
        })
    })
}

module.exports = personalSocket
