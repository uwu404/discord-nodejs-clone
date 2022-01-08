const createMember = require("./createMember")

const createMessage = (message, author) => {
    return {
        _id: message._id,
        content: message.content,
        timestamp: message.timestamp,
        channel: message.channel || message.author._id,
        attachment: message.attachment,
        invite: message.invite,
        author: createMember(author?.username ? author : message.author)
    }
}

module.exports = createMessage