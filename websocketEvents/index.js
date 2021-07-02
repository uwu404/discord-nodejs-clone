const join = require("./events/join")
const serverEv = require("./events/server")

function socketEvents(io) {
    io.on("connection", socket => {
        join(socket)
        serverEv(socket)
    })
}

module.exports = socketEvents