const createMember = ({ username, _id, avatarURL, online, tag, profileColor, flags }, add) => {
    return {
        username, _id, avatarURL, online, tag, profileColor, flags, ...add
    }
}

module.exports = createMember