const Server = require("../../models/server")

function serverEv(socket) {
    socket.on("server", async id => {
        const server = await Server.findOne({ _id: id })
        if (!server) return
        socket.join(`${id}`)
    })
    socket.on("out", id => {
        socket.leave(`${id}`)
    })
}

module.exports = serverEv
