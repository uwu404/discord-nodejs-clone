const Image = require("../../models/image")
const resize = require("../../imageResizer")
const fs = require("node:fs")
const express = require("express")
const router = express.Router()

router.get("/images/:name", async (req, res) => {
    const image = req.params.name === "default" ?
        { data: fs.readFileSync("./public/cat.webp") } :
        await Image.findOne({ name: req.params.name }).catch(err => console.log(err))
    if (!image) return res.status(404).send("//404")
    const height = parseInt(req.query.height)
    const width = parseInt(req.query.width)
    const format = req.query.format

    const send = (buffer) => {
        res.writeHead(200, {
            'Content-Type': 'image/webp',
            'Content-Length': buffer.length,
            "Cache-Control": "public, max-age=31557600"
        })
        res.end(buffer)
    }

    const img = image.data
    if (width || height) {
        const im = await resize(img, { format: format || "webp", width, height })
        return send(im)
    }
    send(img)
})

module.exports = router