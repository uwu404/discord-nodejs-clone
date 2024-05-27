// checks if user is online by finding sockets

const { io } = require("..")

/**
 * @param {string} id
 */
const isOnline = (id) => {
    return io.sockets.adapter.rooms.get(id)?.size
}

module.exports = isOnline