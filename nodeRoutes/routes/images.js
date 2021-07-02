const Image = require("../../models/image")
const sharp = require("sharp")
const resize = require("gif-resizer")

function images(app) {
    app.get("/images/:name", async (req, res) => {
        const image = await Image.findOne({ name: req.params.name }).catch(err => console.log(err))
        if (!image) return res.status(404).send("//404")

        const img = image.data
        if ((parseInt(req.query.height) || parseInt(req.query.width)) && !image.dynamic) {
            const resizer = sharp(img)
            if (req.query.height && req.query.width) resizer.resize(parseInt(req.query.width), parseInt(req.query.height))
            else if (req.query.height) resizer.resize(null, parseInt(req.query.height))
            else if (req.query.width) resizer.resize(parseInt(req.query.width))
            resizer.webp()
            resizer.toBuffer()
                .then(buffer => {
                    res.writeHead(200, {
                        'Content-Type': 'image/webp',
                        'Content-Length': buffer.length
                    });
                    res.end(buffer);
                })
        } else {
            const gif = await resize(img, { 
                width: parseInt(req.query.width), 
                height: parseInt(req.query.height)
            })
            res.writeHead(200, {
                'Content-Type': 'image/webp',
                'Content-Length': gif.length
            });
            res.end(gif);
        }
    })
}

module.exports = images