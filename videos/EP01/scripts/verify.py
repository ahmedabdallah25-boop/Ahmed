import subprocess, io, json, numpy as np
from PIL import Image
V="/home/user/Ahmed/videos/EP01/source.mp4"
ZONES={"TOP":(0,0,1920,380),"RIGHT":(1040,150,1880,940),"LEFT":(40,150,880,940),
       "LOWRIGHT":(990,540,1880,940),"CENTER":(380,280,1540,800)}
sb=json.load(open("/home/user/Ahmed/videos/EP01/storyboard.json"))
def frame(t):
    d=subprocess.run(["ffmpeg","-v","error","-ss",str(t),"-i",V,"-frames:v","1",
                      "-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    return np.asarray(Image.open(io.BytesIO(d)).convert("L"),dtype=np.float32)
bad=[]
for c in sb["cards"]:
    x0,y0,x1,y1=ZONES[c["zone"]]
    vals=[]
    for f in (0.0,0.35,0.7,1.0):
        t=c["startSec"]+(c["endSec"]-c["startSec"])*f
        a=frame(min(t,1070.5))
        if a.size==0: continue
        H,W=a.shape
        e=np.abs(np.diff(a,axis=1)); e=np.pad(e,((0,0),(0,1)))
        vals.append(e[int(y0*H/1080):int(y1*H/1080),int(x0*W/1920):int(x1*W/1920)].mean())
    mx=max(vals)
    flag="  <<< BUSY" if mx>3.0 else ""
    if mx>3.0: bad.append((c["id"],c["startSec"],c["zone"],round(mx,2)))
    print(f'{c["id"]} {c["startSec"]:7.1f} {c["zone"]:9} ' + " ".join(f"{v:5.2f}" for v in vals) + flag)
print("\nBUSY CARDS:", bad)
