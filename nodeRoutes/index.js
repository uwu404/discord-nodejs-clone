const createuser = require("./routes/createuser")
const getuser = require("./routes/getuser")
const sendmessage = require("./routes/sendmessage")
const edituser = require("./routes/edituser")
const images = require("./routes/images")
const getservers = require("./routes/getservers")
const createserver = require("./routes/createserver")
const getchannels = require("./routes/getchannels")
const deleteMessage = require("./routes/messagedelete")
const deleteServer = require("./routes/serverdelete")
const getFriendRequests = require("./routes/getfriendrequests")
const sendFriendRequest = require("./routes/sendfriendrequest")
const getFriends = require("./routes/getfriends")
const acceptFriendRequest = require("./routes/acceptfriendrequest")
const directMessage = require("./routes/directmessage")
const getdms = require("./routes/getdms")
const fetchUser = require("./routes/fetchuser")
const getServer = require("./routes/getserver")
const joinServer = require("./routes/joinserver")
const getDmLogs = require("./routes/getdmlogs")
const getChannelMessages = require("./routes/getChannelMessages")
const getServerMembers = require("./routes/getservermembers")

function nodeRoutes(app, io) {
    createuser(app)
    getChannelMessages(app)
    getuser(app)
    getDmLogs(app)
    getdms(app)
    getServer(app)
    getServerMembers(app)
    directMessage(app, io)
    getFriendRequests(app)
    sendFriendRequest(app)
    acceptFriendRequest(app)
    fetchUser(app)
    edituser(app, io)
    joinServer(app)
    getFriends(app)
    sendmessage(app, io)
    images(app)
    getservers(app)
    createserver(app)
    getchannels(app)
    deleteMessage(app, io)
    deleteServer(app)
}

module.exports = nodeRoutes