#!/usr/bin/env python3
"""Rebuild every X brand asset. Change HANDLE/CURRENCY here, re-run, done."""
from PIL import Image, ImageDraw, ImageFont
import glob
HANDLE="@moneydecoded"; CUR="£"          # <-- single source of truth
NAVY=(0x16,0x20,0x3C); GOLD=(0xE8,0xA3,0x3D); OFFW=(0xF4,0xF1,0xEA)
MUT=(0x6B,0x77,0x93); DIM=(0x9F,0xAB,0xC4); GUIDE=(0x2E,0x3B,0x5E)
BOLD=glob.glob("/usr/share/fonts/**/DejaVuSans-Bold.ttf",recursive=True)[0]
def F(s): return ImageFont.truetype(BOLD,s)
def fit(d,t,x,limit,start):
    for s in range(start,13,-1):
        if d.textbbox((x,0),t,font=F(s))[2] < limit: return F(s)
    return F(14)

# ---- PFP (B: step) ----
S=400; im=Image.new("RGB",(S,S),NAVY); d=ImageDraw.Draw(im); w=int(S*.13)
d.line([(int(S*.20),int(S*.66)),(int(S*.48),int(S*.66)),(int(S*.48),int(S*.34)),(int(S*.80),int(S*.34))],fill=GOLD,width=w,joint="curve")
for p in [(int(S*.20),int(S*.66)),(int(S*.80),int(S*.34))]: d.ellipse([p[0]-w//2,p[1]-w//2,p[0]+w//2,p[1]+w//2],fill=GOLD)
im.save("assets/pfp-b-step.png")

# ---- header: real margins, no stray rule, does NOT repeat the bio ----
H=Image.new("RGB",(1500,500),NAVY); d=ImageDraw.Draw(H)
L,R=430,1360
f=fit(d,"Money, drawn until",L,R,72)
d.text((L,178),"Money, drawn until",font=f,fill=OFFW)
d.text((L,262),"it makes sense.",font=f,fill=GOLD)
H.save("assets/header.png")
g=H.copy(); d=ImageDraw.Draw(g); RED=(0xE0,0x60,0x60)
d.ellipse([60,290,390,620],outline=RED,width=5); d.text((66,252),"profile picture covers this",font=F(19),fill=RED)
for box in ([0,0,1499,74],[0,425,1499,499],[0,0,90,499],[1410,0,1499,499]):
    d.rectangle(box,outline=RED,width=3)
d.text((100,20),"cropped / unsafe on mobile — keep all text inside the middle",font=F(19),fill=RED)
g.save("assets/header-safezone-guide.png")

# ---- post template: an actual grid ----
def grid(d):
    for x in (90,990): d.line([(x,0),(x,1080)],fill=GUIDE,width=2)
    for y in (80,300,860,940,1000): d.line([(0,y),(1080,y)],fill=GUIDE,width=2)
    for y,lab in [(88,"KICKER"),(160,"HEADLINE — 2 lines max"),(310,"GRAPHIC SAFE AREA — the argument lives here"),(870,"TAKEAWAY LINE"),(950,"ASSUMPTIONS — always present when a number appears")]:
        d.text((100,y),lab,font=F(22),fill=GUIDE)
T=Image.new("RGB",(1080,1080),NAVY); d=ImageDraw.Draw(T); grid(d)
d.text((90,1012),HANDLE,font=F(26),fill=MUT); T.save("assets/post-template-blank.png")

# ---- post 1: headline now matches the graphic; real (post-inflation) returns ----
CONTRIB,REAL,END=250,0.045,65
fv=lambda a:CONTRIB*(((1+REAL/12)**((END-a)*12)-1)/(REAL/12))
a,b=fv(25),fv(30); gap=a-b
P=Image.new("RGB",(1080,1080),NAVY); d=ImageDraw.Draw(P)
d.text((90,88),"THE COST OF WAITING",font=F(30),fill=GOLD)
d.text((90,142),"Five years of waiting.",font=F(54),fill=OFFW)
d.text((90,210),f"{CUR}{gap:,.0f} gone.",font=F(54),fill=GOLD)
BASE,TOP=820,380
for i,(lab,v,c) in enumerate([("START AT 25",a,GOLD),("START AT 30",b,MUT)]):
    x=150+i*450; h=int((BASE-TOP)*v/a)
    d.rectangle([x,BASE-h,x+270,BASE],fill=c)
    d.text((x,BASE-h-70),f"{CUR}{v:,.0f}",font=F(54),fill=c)
    d.text((x,BASE+22),lab,font=F(29),fill=OFFW)
d.line([(150,BASE),(930,BASE)],fill=DIM,width=3)
t=f"Same {CUR}{CONTRIB} a month. Same fund. Five years apart."
d.text((150,890),t,font=fit(d,t,150,960,31),fill=DIM)
t2=f"{CUR}{CONTRIB}/mo into a broad equity fund to age {END}. {REAL:.1%} return after inflation,"
t3="so both figures are in today's money. Not a projection of any specific product."
d.text((150,940),t2,font=fit(d,t2,150,980,23),fill=MUT)
d.text((150,970),t3,font=fit(d,t3,150,980,23),fill=MUT)
d.text((90,1020),HANDLE,font=F(26),fill=MUT); P.save("assets/post-example-01.png")
print(f"real-terms: {a:,.0f} / {b:,.0f} / gap {gap:,.0f}")
