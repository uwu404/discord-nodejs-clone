const execa = require("execa")

const convertGif = async (buffer, { height, width, format, quality }) => {
    const base64 = buffer.toString("base64")
    const args = ["gifTools/main.py"]
    if (height || width) args.push("-r", `${width || height}x${height || width}`)
    if (format) args.push("-f", format)
    if (quality) args.push("-q", quality)
    const { stdout } = await execa("python", args, {
        encoding: "utf-8",
        maxBuffer: Infinity,
        input: base64
    })
    const buf = Buffer.from(stdout, "hex")
    return buf
}

module.exports = convertGif

