const createMessage = require("../../globalFunctions/createMessage")
const Message = require("../../models/message")

const editMessage = (app, io) => {
    app.patch("/channels/:channel/messages/:message", async (req, res) => {
        if (!req.body.content.trim()) return
        const message = await Message.findOne({ _id: req.params.message }).populate("author")
        if (!message || message.author.token !== req.headers.authorization) return res.status(403).send({ error: "unvalid message id" })
        message.content = req.body.content.trim()
        await message.save()
        res.send(createMessage(message))
        io.to(req.params.channel).to(`${message.author._id}`).emit("messageEdit", createMessage(message))
    })
}

module.exports = editMessage