import subprocess, io, numpy as np
from PIL import Image
V="/home/user/Ahmed/videos/EP01/source.mp4"
def frame(t):
    d=subprocess.run(["ffmpeg","-v","error","-ss",str(t),"-i",V,"-frames:v","1","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    return np.asarray(Image.open(io.BytesIO(d)).convert("L"),dtype=np.float32)
ts=[i for i in range(5,1065,7)]
rows=[];lum=[]
for t in ts:
    a=frame(t)
    if a.size==0: continue
    g=np.abs(np.diff(a,axis=1)).mean(axis=1)   # per-row horizontal edge energy = "ink"
    rows.append(g); lum.append(a.mean(axis=1))
R=np.array(rows); L=np.array(lum)
H=R.shape[1]
print("frames",R.shape[0],"height",H)
print("\nrow%  meanInk  p90Ink  meanLum   (bottom 20%)")
for y in range(int(H*0.80),H,int(H*0.01)):
    print(f"{100*y/H:5.1f} {R[:,y].mean():7.2f} {np.percentile(R[:,y],90):7.2f} {L[:,y].mean():8.1f}")
print("\nrow%  meanInk  p90Ink  meanLum   (top 20%)")
for y in range(0,int(H*0.20),int(H*0.01)):
    print(f"{100*y/H:5.1f} {R[:,y].mean():7.2f} {np.percentile(R[:,y],90):7.2f} {L[:,y].mean():8.1f}")
