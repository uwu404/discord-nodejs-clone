const createError = (error) => {
    return JSON.stringify({ error })
}

class Err {
    constructor(error, status) {
        this.error = createError(error)
        this.status = status
    }
    send(res) {
        res.status(this.status).send(this.error)
    }
}

const errors = {
    serverLimit: new Err("a user can only create 1 server every hour", 429),
    userNotFound: new Err("invalid email or password", 404),
    unauthorized: new Err("unvalid authentication credentials", 401),
    contentNotFound: new Err("content not found", 404),
    unknownError: new Err("oops something went wrong 😂👌!1!1!!", 500),
    invalidToken: new Err("Invalid Token", 400),
    noPerms: new Err("you need permissions to complete the action", 403),
    invalidArgs: new Err("invalid arguments", 400),
    alreadyInUse: new Err("server invite already in use", 404)
}
 
module.exports = errors