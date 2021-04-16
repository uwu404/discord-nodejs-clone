const join = require("./events/join")

function socketEvents(io) {
    io.on("connection", socket => {
        console.log(`new client with id: ${socket.id}`)
        join(socket)
    })
}

module.exports = socketEvents