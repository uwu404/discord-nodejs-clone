const createuser = require("./routes/createuser")
const getuser = require("./routes/getuser")
const sendmessage = require("./routes/sendmessage")
const edituser = require("./routes/edituser")
const images = require("./routes/images")
const getservers = require("./routes/getservers")
const createserver = require("./routes/createserver")
const getchannels = require("./routes/getchannels")
const deleteMessage = require("./routes/messagedelete")

function nodeRoutes(app, io) {
    createuser(app)
    getuser(app)
    edituser(app)
    sendmessage(app, io)
    images(app)
    getservers(app)
    createserver(app)
    getchannels(app)
    deleteMessage(app, io)
}

module.exports = nodeRoutes