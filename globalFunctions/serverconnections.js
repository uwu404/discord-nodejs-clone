const { io } = require("../")
const createMember = require("./createmember")

const serverConnections = async (server) => {
    const getVCconnections = server.channels.map(async channel => {
        if (channel.type === "text") return channel.toObject()
        const connectedSockets = await io.in(channel._id.toString()).fetchSockets()
        const listOfIds = connectedSockets.map(socket => socket.ultraId)
        // find every user connected to this channel
        const users = server.members.filter(u => listOfIds.includes(u._id.toString()))
        return { ...channel.toObject(), users: users.map(u => createMember(u, io)) }
    })
    const VCconnections = await Promise.all(getVCconnections)
    return VCconnections
}

module.exports = serverConnections