const User = require("../../models/user")
const Message = require("../../models/message")
const Channel = require("../../models/channel")
const Server = require("../../models/server")

function join(socket) {
    socket.on("join", async args => {
        const user = await User.findOne({ token: args.Authorization }).catch(err => console.log(err))
        const channel = await Channel.findById(args.channel)
        const server = await Server.findById(channel.server)
        if (!user || !channel || !server || (!server.members.includes(`${user._id}`))) return
        socket.join(args.channel)
        const messages = await Message.find({ channel: args.channel })
        if (!messages) return
        const authors = Array.from(messages, m => m.author)
        const users = await User.find({ _id: { $in: authors } })
        const mappedMessages = messages.map(m => {
            const user = users.find(u => u._id == m.author)
            const message = {
                _id: m._id,
                content: m.content,
                timestamp: m.timestamp,
                channel: m.channel,
                attachment: {
                    width: m.attachment?.width,
                    height: m.attachment?.height,
                    URL: m.attachment?.URL
                },
                author: { username: user.username, _id: user._id, avatarURL: user.avatarURL, tag: user.tag }
            }
            return message
        })
        socket.emit("messages", { to: `${channel._id}`, messages: mappedMessages })
    })
}

module.exports = join