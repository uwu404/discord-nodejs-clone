const join = require("./events/join")
const personalSocket = require("./events/personalSocket")

function socketEvents(io) {
    io.on("connection", socket => {
        join(socket)
        personalSocket(socket, io)
    })
}

module.exports = socketEvents