const createMember = ({ username, _id, avatarURL, online, tag, profileColor, flags, customStatus }, add) => {
    return {
        username, _id, avatarURL, online, tag, profileColor, flags, customStatus, ...add
    }
}

module.exports = createMember