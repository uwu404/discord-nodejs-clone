const Image = require("../../models/image")
const sharp = require("sharp")
const convertGif = require("../../gifTools")

const images = (app) => {
    app.get("/images/:name", async (req, res) => {
        const image = await Image.findOne({ name: req.params.name }).catch(err => console.log(err))
        if (!image) return res.status(404).send("//404")

        const send = (buffer) => {
            res.writeHead(200, {
                'Content-Type': 'image/webp',
                'Content-Length': buffer.length
            });
            res.end(buffer);
        }

        const img = image.data
        if ((parseInt(req.query.height) || parseInt(req.query.width)) && !image.dynamic) {
            const resizer = sharp(img)
            if (req.query.height && req.query.width) resizer.resize(parseInt(req.query.width), parseInt(req.query.height))
            else if (req.query.height) resizer.resize(null, parseInt(req.query.height))
            else if (req.query.width) resizer.resize(parseInt(req.query.width))
            return resizer.toBuffer().then(send)
        }
        if ((parseInt(req.query.height) || parseInt(req.query.width)) && image.dynamic) {
            const gif = await convertGif(img, { format: "webp", width: req.query.width, height: req.query.height })
            return send(gif)
        }
        send(img)
    })
}

module.exports = images