import subprocess, io, numpy as np
from PIL import Image
V="/home/user/Ahmed/videos/EP01/source.mp4"
# regions in 1920x1080 space -> normalized
REG={"TOP":(40,40,1880,300),"RIGHT":(1150,200,1880,880),"LEFT":(40,200,770,880),
     "LOWLEFT":(40,620,900,950),"LOWRIGHT":(1020,620,1880,950),"CENTER":(400,300,1520,780)}
TS=[44,46,47,48,49,50,56,60,62,64,66]
def frame(t):
    d=subprocess.run(["ffmpeg","-v","error","-ss",str(t),"-i",V,"-frames:v","1","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    return np.asarray(Image.open(io.BytesIO(d)).convert("L"),dtype=np.float32)
print(f"{'t':>7} " + " ".join(f"{k:>8}" for k in REG))
for t in TS:
    a=frame(t); H,W=a.shape
    e=np.abs(np.diff(a,axis=1)); e=np.pad(e,((0,0),(0,1)))
    out=[]
    for k,(x0,y0,x1,y1) in REG.items():
        X0,X1=int(x0*W/1920),int(x1*W/1920); Y0,Y1=int(y0*H/1080),int(y1*H/1080)
        out.append(e[Y0:Y1,X0:X1].mean())
    best=min(range(len(out)),key=lambda i:out[i])
    print(f"{t:7.1f} " + " ".join(f"{v:8.2f}" for v in out) + "   -> " + list(REG)[best])
