const path = require("path")
const fs = require("fs")

const writeFile = async (file, toPath) => {
    const dirname = path.dirname(toPath)
    await fs.promises.mkdir(dirname, { recursive: true })
    await fs.promises.writeFile(toPath, file)
}

module.exports = writeFile