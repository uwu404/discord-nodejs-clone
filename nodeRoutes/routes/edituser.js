const User = require("../../models/user")
const Image = require("../../models/image")
const sharp = require("sharp")
const gifsicle = require("../../gifsicle")

function editavatar(app) {
    app.patch("/@me/user/edit", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        if (req.body.data) {
            const grabage = await Image.findOne({ name: `${user._id}.webp` })
                .catch(err => console.log(err))
            if (req.body.imageType !== 'gif') {
                const icon = sharp(Buffer.from(req.body.data.split(",")[1], "base64"))
                icon.webp({ quality: 50, loop: 0 })
                icon.resize(200, 200)
                const data = await icon.toBuffer()
                save(data)
            } else {
                const width = parseInt(req.body.dimensions.width)
                const height = parseInt(req.body.dimensions.height)
                const toSize = (height < width ? height : width) - 1
                const x = height > width ? 0 : Math.floor((width - height)/2)
                const y = height < width ? 0 : Math.floor((height - width)/2)
                const resizeGif = await gifsicle(Buffer.from(req.body.data.split(",")[1], "base64"), `${x},${y}+${toSize}x${toSize}`).catch(() => console.log("error resizing gif"))
                save(resizeGif)
            }
            async function save(data) {
                const image = new Image({
                    data: data.toString("base64"),
                    name: `${user._id}.webp`
                })
                await image.save()
                user.avatarURL = `http://localhost:80/images/${user._id}.webp`
            }
            grabage.delete()
        }
        if (req.body.username) user.username = req.body.username
        user.save()
            .then(result => res.send(result))
    })
}

module.exports = editavatar