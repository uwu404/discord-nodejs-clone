const fs = require("fs")
const routes = fs.readdirSync("./nodeRoutes/routes").filter(file => file.endsWith(".js"))

function nodeRoutes(app) {
    for (const route of routes) {
        app.use(require("./routes/" + route))
    }
}

module.exports = nodeRoutes