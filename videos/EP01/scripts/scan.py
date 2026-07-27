import subprocess, io, numpy as np
from PIL import Image
V="/home/user/Ahmed/videos/EP01/source.mp4"
ZONES={"TOP":(0,0,1920,380),"RIGHT":(1040,150,1880,940),"LEFT":(40,150,880,940),
       "LOWRIGHT":(990,540,1880,940)}
def ink(t,zone):
    d=subprocess.run(["ffmpeg","-v","error","-ss",str(t),"-i",V,"-frames:v","1",
                      "-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    a=np.asarray(Image.open(io.BytesIO(d)).convert("L"),dtype=np.float32)
    H,W=a.shape; x0,y0,x1,y1=ZONES[zone]
    e=np.abs(np.diff(a,axis=1)); e=np.pad(e,((0,0),(0,1)))
    return e[int(y0*H/1080):int(y1*H/1080),int(x0*W/1920):int(x1*W/1920)].mean()
for label,zone,lo,hi in [("card-04","TOP",29,38),("card-06","TOP",66,82),
                         ("card-09","RIGHT",118,128),("card-10","TOP",151,164),
                         ("card-30","TOP",691,702),("card-40","TOP",1010,1026)]:
    row=" ".join(f"{t}:{ink(t,zone):.1f}" for t in range(lo,hi+1))
    print(f"{label} [{zone}]  {row}")
