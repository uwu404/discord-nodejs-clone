const { io } = require("..")
const User = require("../models/user")
const createMember = require("./createmember")

const emitMessage = async (message, user, channel, eventType) => {
    const isDM = !!(await User.findById(message.channel))
    const filterMessage = { ...message.toObject(), author: createMember(message.author) }
    // if the message is dm and the receiver is the one who's deleting it
    if (message.channel === user._id.toString()) {
        io.to(channel._id.toString()).emit(eventType, Object.assign(filterMessage, { channel: user._id }))
        return io.to(user._id.toString()).emit(eventType, Object.assign(filterMessage, { channel: message.author._id }))
    }
    // if the message is dm and the one who sent it is the one deleting it
    if (isDM) {
        io.to(channel._id.toString()).emit(eventType, Object.assign(filterMessage, { channel: user._id }))
        return io.to(user._id.toString()).emit(eventType, Object.assign(filterMessage, { channel: channel._id }))
    }
    // if the message is not dm
    io.to(channel._id.toString()).emit(eventType, filterMessage)
}

module.exports = emitMessage