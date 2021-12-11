const fs = require("fs")
const routes = fs.readdirSync("./nodeRoutes/routes").filter(file => file.endsWith(".js"))

function nodeRoutes(app, io) {
    for (const route of routes) {
        const fct = require("./routes/" + route)
        fct(app, io)
    }
}

module.exports = nodeRoutes