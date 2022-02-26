# python main.py -f [format] -r [size]
from PIL import Image, ImageSequence
import io
import binascii
import sys
import base64
import argparse

data = ""
for line in sys.stdin: 
    data += line

parser = argparse.ArgumentParser(description="resize animated gifs and reduce their size")
parser.add_argument("-f", "--format", type=str, help="specifies the format the file should be converted to")
parser.add_argument("-r", "--resize", type=str, default="0x0", help="specifies the width and height of the output")
parser.add_argument("-q", "--quality", type=int, default="100", help="reduces the quality of the image")
parser.add_argument("-d", "--dynamic", type=str, default="True", help="specifies if the output should be animated")
args = parser.parse_args()
size = args.resize.split("x")
width = int(size[0])
height = int(size[1])
format = args.format
dynamic = args.dynamic

img = Image.open(io.BytesIO(base64.b64decode(data)))
if format == "gif": img.info.pop('background', None)
frames = ImageSequence.Iterator(img)

def crop_center(img, cw, ch):
    w, h = img.size
    return img.crop(((w - cw) // 2, (h - ch) // 2, (w + cw) // 2, (h + ch) // 2))

def info():
    w, h = img.size
    x = min(w, h)
    y = max(w, h)
    mesure = x / y
    ratio = height / width if w > h else width / height
    to_size = x / ratio
    infoW = (to_size, x) if ratio >= mesure else (y, y * ratio)
    infoH = (x, to_size) if ratio >= mesure else (y * ratio, y)
    return infoW if w > h else infoH

def pics(frames):
    for frame in frames: 
        pic = frame.copy()
        if width and height:
            wh = info()
            pic = crop_center(pic, wh[0], wh[1])
            pic = pic.resize((width, height), Image.ANTIALIAS)
        yield pic

frames = pics(frames)
om = next(frames)
om.info = img.info
output = io.BytesIO()

if dynamic == "True":
    om.save(output, format, save_all=True, append_images=frames, loop=0, quality=args.quality, optimize=True)
else: 
    om.save(output, format, loop=0, quality=args.quality, optimize=True)

data = output.getvalue()
hex = binascii.hexlify(data).decode("utf-8")
sys.stdout.write(hex)
sys.stdout.flush()
