const Image = require("../../models/image")
const sharp = require("sharp")

function images(app) {
    app.get("/images/:name", async (req, res) => {
        const image = await Image.findOne({ name: req.params.name }).catch(err => console.log(err))
        if (!image) {
            res.send("// 404")
            res.status = 404
            return
        }

        const img = Buffer.from(image.data, 'base64');
        if (parseInt(req.query.height) || parseInt(req.query.width)) {
            //no gif support
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
            res.writeHead(200, {
                'Content-Type': 'image/webp',
                'Content-Length': img.length
            });
            res.end(img);
        }
    })
}

module.exports = images