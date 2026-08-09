"""Force-align the 45 VO lines to real speech onsets, then rebuild the cut."""
import os, re, glob, subprocess, numpy as np, imageio_ffmpeg, wave
FF = imageio_ffmpeg.get_ffmpeg_exe()
UP = "/root/.claude/uploads/995275fd-74b3-52e3-bc77-35de4ea73d74"
SP = "/tmp/claude-0/-home-user-Ahmed/995275fd-74b3-52e3-bc77-35de4ea73d74/scratchpad"
SEG = f"{SP}/seg2"; os.makedirs(SEG, exist_ok=True)
VO = f"{UP}/bed94b5c-ElevenLabs_20260809T16_36_42_Ahmed_new_1_gen_sp100_s50_sb86_v3.mp3"
VOD = 135.47; FPS = 30; W, H = 1080, 1920
OUTRO = 4.0; MINDUR = 1.0

pack = open("/home/user/Ahmed/pension-scene-pack.txt").read()
raw = pack.split("VOICEOVER")[1].split("TAG NOTES")[0].split("\n")
i0 = next(i for i, l in enumerate(raw) if l.startswith("[matter-of-fact] Your pension"))
lines = [re.sub(r"^\[[^\]]*\]\s*", "", l).strip()
         for l in raw[i0:] if l.strip() and not l.startswith("=")]
assert len(lines) == 46, len(lines)
lines = lines[:45]                      # line 46 shares scene 45's shot

# ---- speech onsets ----
err = subprocess.run([FF, "-i", VO, "-af", "silencedetect=noise=-34dB:d=0.16",
                      "-f", "null", "-"], capture_output=True, text=True).stderr
cands = sorted(float(x) for x in re.findall(r"silence_end: ([\d.]+)", err))
cands = [c for c in cands if 0.5 < c < VOD - 0.5]

# ---- expected durations: constant per-line pause + time proportional to text ----
chars = np.array([len(l) for l in lines], float)
base = 0.20
per = (VOD - base*len(lines)) / chars.sum()
exp = base + chars*per

def cost(d, e):
    if d < MINDUR: return 1e6 + (MINDUR-d)*1e5
    return (d-e)**2/e

# ---- DP: pick 44 onsets, in order, as the starts of lines 2..45 ----
N, L = len(cands), len(lines)
INF = float("inf")
dp = [[INF]*N for _ in range(L+1)]      # dp[i][j] = line i starts at cands[j]
bk = [[-1]*N for _ in range(L+1)]
for j in range(N):
    dp[2][j] = cost(cands[j] - 0.0, exp[0])
for i in range(2, L):
    for j in range(N):
        if dp[i][j] == INF: continue
        for k in range(j+1, N):
            c = dp[i][j] + cost(cands[k]-cands[j], exp[i-1])
            if c < dp[i+1][k]: dp[i+1][k] = c; bk[i+1][k] = j
best, bj = INF, -1
for j in range(N):
    if dp[L][j] == INF: continue
    c = dp[L][j] + cost(VOD - cands[j], exp[L-1])
    if c < best: best, bj = c, j
assert bj >= 0
idx = [bj]
for i in range(L, 2, -1): idx.append(bk[i][idx[-1]]);
idx = list(reversed(idx))
starts = {1: 0.0}
for n, j in enumerate(idx, start=2): starts[n] = cands[j]
starts[46] = VOD
dur = {s: starts[s+1]-starts[s] for s in range(1, 46)}
dur[46] = OUTRO
starts[46] = VOD
TOTAL = VOD + OUTRO
drift = [(s, round(dur[s], 2), round(exp[s-1], 2)) for s in range(1, 46)]
print("min scene", min(dur[s] for s in range(1, 46)),
      "max", round(max(dur[s] for s in range(1, 46)), 2))
print("reveal 34 at", round(starts[34], 2), "turn 36 at", round(starts[36], 2),
      "step3 41 at", round(starts[41], 2))

# ---- image map (unchanged) ----
M = {1:"Checkbox_with_rust_red_tick",2:"7a5f3768-Man_addressing_camera_seriously",
 3:"Stack_of_blank_cream_envelopes",4:"b9683805-Blank_document_and_cards",
 5:"87c75e69-Three_characters_standing_in_row",6:"546306d8-Three_meshed_cog_wheels",
 7:"6590c495-Character_vector_illustration",8:"Hand_pushing_slider_knob",
 9:"Eight_identical_toggle_switches",10:"Blank_card_in_holder",
 11:"Three_men_standing_in_boxes",12:"Man_lifting_box_lid",
 13:"a523d1ee-Basket_filled_with_blank_blocks",14:"Blocks_dropping_into_basket",
 15:"Blocks_falling_through_sieve_frame",16:"Man_crouching_beside_basket",
 17:"Pie_chart_wedge_pulled_out",18:"Four_objects_in_a_row",
 19:"Drafting_compasses_on_blueprint",20:"Teal_pie_wedge_illustration",
 21:"Empty_service_bell_on_counter",22:"Clock_face_and_standing_coin",
 23:"Clerk_standing_behind_counter",24:"Five_identical_bank_tellers",
 25:"Illustrated_man_with_questioning",26:"Hourglass_with_falling_sand",
 27:"Vector_illustration_of_curved_ramp",28:"Blanket_draped_over_wooden_chair",
 29:"Man_standing_front_view",30:"Mechanical_arm_lifting_blocks",
 31:"Basket_filled_with_blank_certifi",32:"Cream_certificate_with_teal_cord",
 33:"Hands_exchanging_coins",34:"Person_walking_down_sand_ramp",
 35:"Cog_wheels_turning_behind_glass",36:"Man_gesturing_warmly",
 37:"Smartphone_vector_illustration",38:"Blank_labels_hanging_from_basket",
 39:"Magnifying_glass_over_blank_list",40:"Vector_illustration_of_list_sheet",
 41:"Concertina_document_unfolding",42:"Cartoon_hand_pushing_toggle_switch",
 43:"Two_woven_baskets_holding_blocks",44:"Man_marking_checkbox_with_pen",
 45:"Illustration_of_man_smiling",46:"Olive_band_on_cream_background"}
files = {}
for s, frag in M.items():
    hit = [p for p in glob.glob(f"{UP}/*.jpeg") if frag in os.path.basename(p)]
    assert len(hit) == 1, (s, frag); files[s] = hit[0]

for s in range(1, 47):
    d = dur[s]; n = max(2, int(round(d*FPS)))
    if s % 3 == 0:
        z = "1.06"; x = f"'(iw-iw/zoom)/2+(on/{n}-0.5)*(iw*0.035)'"; y = "'(ih-ih/zoom)/2'"
    else:
        z = f"'1+0.065*on/{n}'"; x = "'iw/2-(iw/zoom/2)'"; y = "'ih/2-(ih/zoom/2)'"
    vf = (f"scale=2160:3840:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop=2160:3840,zoompan=z={z}:x={x}:y={y}:d={n}:s={W}x{H}:fps={FPS},format=yuv420p")
    subprocess.run([FF,"-y","-loglevel","error","-loop","1","-i",files[s],
        "-frames:v",str(n),"-vf",vf,"-c:v","libx264","-preset","veryfast",
        "-crf","18",f"{SEG}/{s:02d}.mp4"], check=True)
with open(f"{SEG}/list.txt","w") as f:
    for s in range(1,47): f.write(f"file '{SEG}/{s:02d}.mp4'\n")
subprocess.run([FF,"-y","-loglevel","error","-f","concat","-safe","0","-i",
    f"{SEG}/list.txt","-c","copy",f"{SP}/video2.mp4"], check=True)

# ---- sfx re-keyed to the aligned cuts ----
SR = 44100; N2 = int(TOTAL*SR)+SR
bed = np.zeros(N2); tt = np.arange(N2)/SR
def env(a,d,rel,l):
    e=np.ones(l); ai=int(a*SR); ri=int(rel*SR)
    if ai: e[:ai]=np.linspace(0,1,ai)
    if ri: e[-ri:]=np.linspace(1,0,ri)
    return e*np.exp(-np.arange(l)/SR/d)
def place(sig,at,g):
    i=int(at*SR); j=min(N2,i+len(sig))
    if 0<=i<N2: bed[i:j]+=sig[:j-i]*g
rng=np.random.default_rng(7)
pad=(0.55*np.sin(2*np.pi*98*tt)+0.32*np.sin(2*np.pi*147*tt)+0.18*np.sin(2*np.pi*196*tt))
pad*=1+0.18*np.sin(2*np.pi*0.045*tt)
bed+=pad*np.clip(np.minimum(tt/6.0,(TOTAL-tt)/6.0),0,1)*0.016
for s in range(2,47):
    l=int(0.10*SR); nse=rng.standard_normal(l)
    for _ in range(3): nse=np.convolve(nse,np.ones(9)/9,mode="same")
    place(nse*env(0.001,0.030,0.02,l), starts[s]-0.045, 0.055)
for s,g in ((1,0.10),(15,0.085),(34,0.11),(44,0.085)):
    l=int(0.9*SR); e=env(0.004,0.16,0.3,l); ph=np.arange(l)/SR
    place(np.sin(2*np.pi*54*ph)*e+0.4*np.sin(2*np.pi*81*ph)*e, starts[s], g)
l=int(1.6*SR); ph=np.arange(l)/SR
place(np.sin(2*np.pi*(196+120*ph/1.6)*ph)*env(0.35,0.55,0.6,l), starts[36]-0.3, 0.030)
l=int(3.2*SR); ph=np.arange(l)/SR; ch=sum(np.sin(2*np.pi*f*ph) for f in (196.,261.6,329.6))
place(ch*env(0.9,1.4,1.2,l)/3, starts[45], 0.034)
p=np.abs(bed).max()
if p>0.5: bed*=0.5/p
with wave.open(f"{SP}/sfx2.wav","wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(bed,-1,1)*32767).astype("<i2").tobytes())

e=subprocess.run([FF,"-i",f"{SP}/video2.mp4"],capture_output=True,text=True).stderr
h,m,sec=re.search(r"Duration: (\d+):(\d+):([\d.]+)",e).groups()
VD=int(h)*3600+int(m)*60+float(sec)
OUT=f"{SP}/pension-short-aligned.mp4"
subprocess.run([FF,"-y","-loglevel","error","-i",f"{SP}/video2.mp4","-i",VO,"-i",f"{SP}/sfx2.wav",
 "-filter_complex",
 f"[1:a]aformat=fltp:44100:mono,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad=whole_dur={VD}[v];"
 f"[2:a]aformat=fltp:44100:mono,volume=0.5,aresample=48000,atrim=0:{VD}[s];"
 "[v][s]amix=inputs=2:duration=first:normalize=0[a]",
 "-map","0:v","-map","[a]","-c:v","copy","-c:a","aac","-b:a","192k","-ar","48000",
 "-t",str(VD),"-movflags","+faststart",OUT], check=True)
print("OUT",OUT,round(os.path.getsize(OUT)/1e6,1),"MB","dur",VD)
print("worst 6 drift:", sorted(drift,key=lambda r:-abs(r[1]-r[2]))[:6])
