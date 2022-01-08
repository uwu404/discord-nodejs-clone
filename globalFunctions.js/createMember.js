const createMember = ({ username, _id, avatarURL, online, tag, profileColor }, add) => {
    return {
        username, _id, avatarURL, online, tag, profileColor, ...add
    }
}

module.exports = createMember