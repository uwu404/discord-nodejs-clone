const Image = require("../models/image")
const sharp = require("sharp")
const sizeOf = require("image-size")
const convertGif = require("../gifTools")

const newAvatar = async (data, { avatarURL, icon, attachment }, options) => {
    const oldImageURI = avatarURL || icon
    const base64ex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/
    if (!base64ex.test(data)) return oldImageURI

    const grabage = await Image.findOne({ name: `${oldImageURI?.split("/")[1]}` })

    const buffer = Buffer.from(data, "base64")
    const size = sizeOf(buffer)
    const min = options.width === options.height && Math.min(size.width, size.height)
    const lim = (options.width > min || options.height > min) && min

    const save = async (data, dynamic) => {
        const image = new Image({ data, dynamic })
        image.name = `${image._id}`
        await image.save()
        grabage?.delete()
        if (attachment) return { URL: `images/${image._id}`, width: size.width, height: size.height }
        return `images/${image._id}`
    }

    if (size.type !== "gif") {
        const icon = sharp(buffer)
        icon.webp({ quality: options.quality })
        if (options.width) icon.resize(lim || options.width, lim || options.height)
        const data = await icon.toBuffer()
        return await save(data, false)
    }

    const obj = {
        format: "webp",
        ...((options.width && options.height) && { width: lim || options.width, height: lim || options.height }),
        quality: options.quality
    }

    const webp = await convertGif(buffer, obj)
    return await save(webp, true)
}

module.exports = newAvatar