const execa = require('execa');
const gif2webpbin = require("gif2webp-bin")
const gifsicle = require('gifsicle');
const execBuffer = require("exec-buffer")

function gifsicleWrapper(buffer, size) {
    const promise = new Promise(async (res, rej) => {
        if (!Buffer.isBuffer(buffer)) rej("invalid input")
        const { stdout } = await execa(gifsicle, ['--crop', size, "--optimize=1", "--colors=150", "--resize", "200x200"], {
            encoding: null,
            maxBuffer: Infinity,
            input: buffer
        })
        const webpbuf = execBuffer({
            input: stdout,
            bin: gif2webpbin,
            args: ["-q", "90", "-o", execBuffer.output, execBuffer.input]
        })
        res(webpbuf)
    })
    return promise
}

module.exports = gifsicleWrapper