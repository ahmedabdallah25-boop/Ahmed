import os, re, glob, json, subprocess, numpy as np, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
UP = "/root/.claude/uploads/995275fd-74b3-52e3-bc77-35de4ea73d74"
SP = "/tmp/claude-0/-home-user-Ahmed/995275fd-74b3-52e3-bc77-35de4ea73d74/scratchpad"
SEG = f"{SP}/seg"; os.makedirs(SEG, exist_ok=True)
VO = f"{UP}/bed94b5c-ElevenLabs_20260809T16_36_42_Ahmed_new_1_gen_sp100_s50_sb86_v3.mp3"
VOD = 135.47; FPS = 30; W, H = 1080, 1920

# scene -> unique filename fragment
M = {
 1:"Checkbox_with_rust_red_tick", 2:"7a5f3768-Man_addressing_camera_seriously",
 3:"Stack_of_blank_cream_envelopes", 4:"b9683805-Blank_document_and_cards",
 5:"87c75e69-Three_characters_standing_in_row", 6:"546306d8-Three_meshed_cog_wheels",
 7:"6590c495-Character_vector_illustration", 8:"Hand_pushing_slider_knob",
 9:"Eight_identical_toggle_switches", 10:"Blank_card_in_holder",
 11:"Three_men_standing_in_boxes", 12:"Man_lifting_box_lid",
 13:"a523d1ee-Basket_filled_with_blank_blocks", 14:"Blocks_dropping_into_basket",
 15:"Blocks_falling_through_sieve_frame", 16:"Man_crouching_beside_basket",
 17:"Pie_chart_wedge_pulled_out", 18:"Four_objects_in_a_row",
 19:"Drafting_compasses_on_blueprint", 20:"Teal_pie_wedge_illustration",
 21:"Empty_service_bell_on_counter", 22:"Clock_face_and_standing_coin",
 23:"Clerk_standing_behind_counter", 24:"Five_identical_bank_tellers",
 25:"Illustrated_man_with_questioning", 26:"Hourglass_with_falling_sand",
 27:"Vector_illustration_of_curved_ramp", 28:"Blanket_draped_over_wooden_chair",
 29:"Man_standing_front_view", 30:"Mechanical_arm_lifting_blocks",
 31:"Basket_filled_with_blank_certifi", 32:"Cream_certificate_with_teal_cord",
 33:"Hands_exchanging_coins", 34:"Person_walking_down_sand_ramp",
 35:"Cog_wheels_turning_behind_glass", 36:"Man_gesturing_warmly",
 37:"Smartphone_vector_illustration", 38:"Blank_labels_hanging_from_basket",
 39:"Magnifying_glass_over_blank_list", 40:"Vector_illustration_of_list_sheet",
 41:"Concertina_document_unfolding", 42:"Cartoon_hand_pushing_toggle_switch",
 43:"Two_woven_baskets_holding_blocks", 44:"Man_marking_checkbox_with_pen",
 45:"Illustration_of_man_smiling", 46:"Olive_band_on_cream_background",
}
files = {}
for s, frag in M.items():
    hit = [p for p in glob.glob(f"{UP}/*.jpeg") if frag in os.path.basename(p)]
    assert len(hit) == 1, (s, frag, len(hit))
    files[s] = hit[0]

# pack timecodes -> proportional durations, scaled to real VO
pack = open("/home/user/Ahmed/pension-scene-pack.txt").read()
tc = re.findall(r"SCENE (\d+) \| (\d+):(\d+)-(\d+):(\d+)", pack)
raw = {int(n): (int(c)*60+int(d)) - (int(a)*60+int(b)) for n, a, b, c, d in tc}
span = sum(raw[s] for s in range(1, 46))          # 192s of VO in the pack
k = VOD / span
dur = {s: raw[s]*k for s in range(1, 46)}
dur[46] = 4.0
# absorb rounding into scene 45 so video length == VO length exactly
dur[45] += VOD - sum(dur[s] for s in range(1, 46))
starts = {}; t = 0.0
for s in range(1, 47): starts[s] = t; t += dur[s]
TOTAL = t

# ---------- video segments: hard cuts, slow push-in / lateral drift ----------
for s in range(1, 47):
    d = dur[s]; n = max(2, int(round(d*FPS)))
    if s % 3 == 0:                                  # lateral drift
        z = "1.06"
        x = f"'(iw-iw/zoom)/2+(on/{n}-0.5)*(iw*0.035)'"
        y = "'(ih-ih/zoom)/2'"
    else:                                           # slow push-in
        z = f"'1+0.065*on/{n}'"
        x = "'iw/2-(iw/zoom/2)'"; y = "'ih/2-(ih/zoom/2)'"
    vf = (f"scale=2160:3840:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop=2160:3840,zoompan=z={z}:x={x}:y={y}:d={n}:s={W}x{H}:fps={FPS},"
          f"format=yuv420p")
    subprocess.run([FF, "-y", "-loglevel", "error", "-loop", "1", "-i", files[s],
                    "-frames:v", str(n), "-vf", vf, "-c:v", "libx264", "-preset",
                    "veryfast", "-crf", "18", f"{SEG}/{s:02d}.mp4"], check=True)

with open(f"{SEG}/list.txt", "w") as f:
    for s in range(1, 47): f.write(f"file '{SEG}/{s:02d}.mp4'\n")
subprocess.run([FF, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                "-i", f"{SEG}/list.txt", "-c", "copy", f"{SP}/video.mp4"], check=True)

# ---------- sound design ----------
SR = 44100; N = int(TOTAL*SR)+SR
bed = np.zeros(N, dtype=np.float64)
tt = np.arange(N)/SR

def env(a, d, rel, length):
    e = np.ones(length); ai = int(a*SR); ri = int(rel*SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] = np.linspace(1, 0, ri)
    return e * np.exp(-np.arange(length)/SR/d)

def place(sig, at, gain):
    i = int(at*SR); j = min(N, i+len(sig))
    if i < N: bed[i:j] += sig[:j-i]*gain

rng = np.random.default_rng(7)

# 1. warm pad — very low, breathes slightly. sits ~35 dB under the VO.
pad = (0.55*np.sin(2*np.pi*98*tt) + 0.32*np.sin(2*np.pi*147*tt)
       + 0.18*np.sin(2*np.pi*196*tt))
pad *= 1 + 0.18*np.sin(2*np.pi*0.045*tt)
fade = np.clip(np.minimum(tt/6.0, (TOTAL-tt)/6.0), 0, 1)
bed += pad*fade*0.016

# 2. soft paper tick on every hard cut
for s in range(2, 47):
    L = int(0.10*SR)
    nse = rng.standard_normal(L)
    for _ in range(3):                      # cheap low-pass -> soft, not clicky
        nse = np.convolve(nse, np.ones(9)/9, mode="same")
    place(nse*env(0.001, 0.030, 0.02, L), starts[s]-0.035, 0.055)

# 3. sub thump on the load-bearing beats
for s, g in ((1, 0.10), (15, 0.085), (34, 0.11), (44, 0.085)):
    L = int(0.9*SR); e = env(0.004, 0.16, 0.3, L); ph = np.arange(L)/SR
    place(np.sin(2*np.pi*54*ph)*e + 0.4*np.sin(2*np.pi*81*ph)*e, starts[s], g)

# 4. the turn at scene 36 — gentle upward lift, not a sting
L = int(1.6*SR); ph = np.arange(L)/SR
sweep = np.sin(2*np.pi*(196+120*ph/1.6)*ph)*env(0.35, 0.55, 0.6, L)
place(sweep, starts[36]-0.3, 0.030)

# 5. resolve at 45 — a soft consonant settle under the close
L = int(3.2*SR); ph = np.arange(L)/SR; ch = np.zeros(L)
for f in (196.0, 261.6, 329.6):
    ch += np.sin(2*np.pi*f*ph)
place(ch*env(0.9, 1.4, 1.2, L)/3, starts[45], 0.034)

peak = np.abs(bed).max()
if peak > 0.5: bed *= 0.5/peak
import wave
with wave.open(f"{SP}/sfx.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(bed, -1, 1)*32767).astype("<i2").tobytes())

# ---------- mux: VO stays dominant ----------
OUT = f"{SP}/pension-short.mp4"
subprocess.run([FF, "-y", "-loglevel", "error", "-i", f"{SP}/video.mp4", "-i", VO,
    "-i", f"{SP}/sfx.wav", "-filter_complex",
    "[1:a]aformat=fltp:44100:mono,loudnorm=I=-16:TP=-1.5:LRA=11[v];"
    "[2:a]aformat=fltp:44100:mono,volume=0.5[s];"
    "[v][s]amix=inputs=2:duration=first:dropout_transition=0:weights=1 1[a]",
    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    "-shortest", "-movflags", "+faststart", OUT], check=True)

o = subprocess.run([FF, "-i", OUT], capture_output=True, text=True).stderr
print("\n".join(l for l in o.split("\n") if "Duration" in l or "Stream" in l))
print("OUT", OUT, round(os.path.getsize(OUT)/1e6, 1), "MB")
print("scene 34 reveal at", round(starts[34], 1), "s | turn 36 at", round(starts[36], 1), "s")
