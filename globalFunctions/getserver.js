const Server = require("../models/server")

// gets a server from text
/** @param {string} text */
const getServer = async (text) => {
    const invite = text?.match(/(^|\s)server\/.{4,20}(?=\s|$)/g)?.[0]
    if (invite) {
        const server = await Server.findOne({ invites: invite.split("/")[1] })
        return server
    }
    return null
}

module.exports = getServer