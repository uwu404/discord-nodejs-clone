const Image = require("../models/image")
const sizeOf = require("image-size")
const resize = require("../gifTools")

const save = async (data, size) => {
    const image = new Image({ data })
    image.name = `${image._id}`
    await image.save()
    return {
        URL: `images/${image._id}`, 
        width: size.width, 
        height: size.height,
        type: size.type
    }
}

const isBase64 = (str) => {
    if (typeof str !== "string") return false
    const buffer = Buffer.from(str, "base64")
    return buffer.toString("base64") === str
}

const createImage = async (data, options) => {
    if (!isBase64(data)) return null

    const buffer = Buffer.from(data, "base64")
    const size = sizeOf(buffer)
    const min = options.width === options.height && Math.min(size.width, size.height)
    const lim = (options.width > min || options.height > min) && min

    const image = await resize(buffer, {
        format: "webp",
        width: lim || options.width,
        height: lim || options.height,
        quality: options.quality
    })
    return await save(image, size)
}

module.exports = createImage