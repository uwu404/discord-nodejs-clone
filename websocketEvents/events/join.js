const User = require("../../models/user")
const Message = require("../../models/message")

function join(socket) {
    socket.on("join", async args => {
        const user = await User.findOne({ token: args.Authorization }).catch(err => console.log(err))
        if (!user) return
        socket.join(args.channel)
        const messages = await Message.find({ channel: args.channel })
        const authors = Array.from(messages, m => m.author)
        const users = await User.find({ _id: { $in: authors } })
        const mappedMessages = messages.map(m => {
            const user = users.find(u => u._id == m.author)
            const message = {
                _id: m._id,
                content: m.content,
                timestamp: m.timestamp,
                channel: m.channel,
                author: { username: user.username, _id: user._id, avatarURL: user.avatarURL, tag: user.tag }
            }
            return message
        })
        socket.emit("messages", mappedMessages)
    })
}

module.exports = join