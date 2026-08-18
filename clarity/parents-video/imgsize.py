#!/usr/bin/env python3
"""Pixel dimensions of PNG/JPEG files, read from the header. No PIL here."""
import struct, sys, os

def size(path):
    with open(path, "rb") as f:
        head = f.read(26)
        if head[:8] == b"\x89PNG\r\n\x1a\n":
            return struct.unpack(">II", head[16:24])
        if head[:2] == b"\xff\xd8":
            f.seek(2)
            while True:
                b = f.read(1)
                while b and b != b"\xff":
                    b = f.read(1)
                marker = f.read(1)
                while marker == b"\xff":
                    marker = f.read(1)
                if not marker:
                    return None
                if marker[0] in tuple(range(0xC0, 0xC4)) + tuple(range(0xC5, 0xC8)) + tuple(range(0xC9, 0xCC)):
                    f.read(3)
                    h, w = struct.unpack(">HH", f.read(4))
                    return w, h
                ln = struct.unpack(">H", f.read(2))[0]
                f.seek(ln - 2, 1)
    return None

for p in sys.argv[1:]:
    d = size(p)
    print(f"{os.path.basename(p):<28}{d[0]}x{d[1]}" if d else f"{os.path.basename(p):<28}?")
