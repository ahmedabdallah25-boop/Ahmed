import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {FONT} from '../theme';
import {count, money} from '../motion';
import {
  Cam,
  Caption,
  D,
  Dust,
  Figure,
  Grade,
  MONO,
  Readout,
  Ruled,
  Shaft,
  Sheet,
  Slug,
  rnd,
} from './scene-kit';

// ─────────────────────────────────────────────────────────────────────────────
// Part 15 — "The Loan That Grew" · 3D-mannequin documentary cut.
//
// Same script as the kinetic Short, told the way the documentary lane tells it:
// one anonymous figure, a case file, real dates and real arithmetic, and the
// mechanism revealed as the turn. 20s, 8 shots, hard cuts, burned-in narration.
//
// Every shot is a pair — the footage layer sits under the grade, the narration
// layer sits over it, exactly like a real edit. The VO track drops straight in;
// see ../../script-part15-dossier.md for the read and the shot timings.
// ─────────────────────────────────────────────────────────────────────────────

const Room: React.FC<{tint?: string}> = ({tint = '#12202A'}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(170deg, ${tint} 0%, #080D12 60%, #05080B 100%)`,
    }}
  />
);

// ── shot 1: the signing ──────────────────────────────────────────────────────

const Scene1: React.FC<{dur: number}> = ({dur}) => (
  <Cam dur={dur} from={1.02} to={1.1} panY={-10} seed={1}>
    <Room />
    <Shaft x={520} y={-260} angle={16} width={420} length={1500} opacity={0.26} />
    <Shaft x={170} y={-300} angle={24} width={260} length={1400} opacity={0.14} />
    <Figure x={330} y={700} scale={1.0} pose="sit" litFrom="right" />
    {/* the screen she is signing on — the room's only warm practical */}
    <div
      style={{
        position: 'absolute',
        left: 606,
        top: 806,
        width: 330,
        height: 232,
        background: 'linear-gradient(180deg, #202C36, #0C1216)',
        transform: 'perspective(900px) rotateX(-10deg) rotateY(-14deg)',
        padding: 12,
        boxShadow: `0 0 160px ${D.amber}44`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(180deg, ${D.amberHot}, ${D.amber})`,
          opacity: 0.55,
          filter: 'blur(1px)',
        }}
      />
    </div>
    {/* desk plane, in front of the subject — the lower body is never seen */}
    <div
      style={{
        position: 'absolute',
        left: -60,
        right: -60,
        top: 1030,
        height: 116,
        background: `linear-gradient(180deg, #2A3742 0%, #101820 100%)`,
        clipPath: 'polygon(9% 0, 91% 0, 100% 100%, 0 100%)',
        boxShadow: '0 -40px 70px rgba(0,0,0,0.75)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -60,
        right: -60,
        top: 1144,
        height: 620,
        background: 'linear-gradient(180deg, #0B1116 0%, #04070A 70%)',
      }}
    />
    <Sheet x={196} y={1042} w={310} h={96} rotate={-3} />
    <Dust count={40} seed={2} />
  </Cam>
);

const Text1: React.FC = () => (
  <>
    <Slug text="CASE FILE 015 · STUDENT DEBT" at={4} />
    <Caption text="SHE BORROWED $30,000." at={16} />
  </>
);

// ── shot 2: sixty payments ───────────────────────────────────────────────────

const Scene2: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.05} to={1.16} seed={2}>
      <Room tint="#0E1A22" />
      <Shaft x={760} y={-320} angle={-18} width={340} length={1600} opacity={0.16} />
      <div
        style={{
          position: 'absolute',
          left: 81,
          top: 470,
          width: 918, // exactly 12 across × 5 rows = 60 payments
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
        }}
      >
        {new Array(60).fill(0).map((_, i) => {
          const at = 6 + i * 1.05;
          const on = interpolate(frame, [at, at + 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                width: 60,
                height: 60,
                border: `2px solid ${D.steel}`,
                background: `rgba(224,164,92,${0.6 * on})`,
                boxShadow: on > 0.5 ? `0 0 26px rgba(224,164,92,0.4)` : 'none',
              }}
            />
          );
        })}
      </div>
      <Figure x={690} y={1090} scale={0.66} pose="stand" tone="#55636D" />
      <Dust count={30} seed={5} />
    </Cam>
  );
};

const Text2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Slug text="60 PAYMENTS · 2021—2026" at={2} />
      <Readout label="PAID" value={money(count(frame, 8, 54, 0, 9000))} at={8} y={1180} />
      <Caption text="SHE PAID EVERY MONTH FOR FIVE YEARS." at={12} size={56} />
    </>
  );
};

// ── shot 3: the statement ────────────────────────────────────────────────────

const Scene3: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const stamp = interpolate(frame, [30, 38], [1.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const stampO = interpolate(frame, [30, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Cam dur={dur} from={1.0} to={1.22} panY={-30} seed={3}>
      <Room tint="#141C24" />
      <Shaft x={420} y={-360} angle={10} width={560} length={1700} opacity={0.26} />
      <Sheet x={150} y={520} w={790} h={880} rotate={-2.5}>
        <div
          style={{fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: '#33362F'}}
        >
          STATEMENT OF ACCOUNT
        </div>
        <Ruled rows={7} width={640} />
        <div
          style={{
            marginTop: 26,
            fontSize: 38,
            fontFamily: MONO,
            letterSpacing: 3,
            color: '#33362F',
          }}
        >
          BALANCE OUTSTANDING
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 124,
            fontWeight: 700,
            color: D.red,
            letterSpacing: -4,
            transform: `scale(${stamp}) rotate(-1.5deg)`,
            transformOrigin: 'left center',
            opacity: stampO,
          }}
        >
          $31,790
        </div>
      </Sheet>
      <Dust count={26} seed={7} />
    </Cam>
  );
};

const Text3: React.FC = () => <Caption text="THE BALANCE WAS $31,790." at={42} />;

// ── shot 4: nothing had gone wrong ───────────────────────────────────────────

const Scene4: React.FC<{dur: number}> = ({dur}) => (
  <Cam dur={dur} from={1.16} to={1.04} seed={4}>
    <Room tint="#0D1720" />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 260,
        height: 1000,
        background: `radial-gradient(48% 58% at 50% 40%, ${D.ice}33 0%, transparent 72%)`,
      }}
    />
    <Figure x={390} y={700} scale={1.0} pose="stand" litFrom="left" />
    <div
      style={{
        position: 'absolute',
        left: 320,
        top: 1300,
        width: 440,
        height: 30,
        background: '#000',
        filter: 'blur(30px)',
        opacity: 0.85,
      }}
    />
    <Dust count={22} seed={9} />
  </Cam>
);

const Text4: React.FC = () => <Caption text="NOTHING HAD GONE WRONG." at={8} />;

// ── shot 5: the mechanism ────────────────────────────────────────────────────

const Bar: React.FC<{
  label: string;
  value: string;
  w: number;
  color: string;
  at: number;
  top: number;
}> = ({label, value, w, color, at, top}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [at, at + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const o = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', left: 96, top, opacity: o}}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 6,
          color: D.ice,
          marginBottom: 14,
        }}
      >
        {label}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <div
          style={{
            height: 64,
            width: 620 * w * grow,
            background: `linear-gradient(90deg, ${color}, ${color}66)`,
            boxShadow: `0 0 60px ${color}55`,
          }}
        />
        <div style={{fontSize: 64, fontWeight: 700, color}}>{value}</div>
      </div>
    </div>
  );
};

const Scene5: React.FC<{dur: number}> = ({dur}) => (
  <Cam dur={dur} from={1.04} to={1.12} seed={5}>
    <Room tint="#0B161E" />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${D.steel}26 1px, transparent 1px), linear-gradient(90deg, ${D.steel}26 1px, transparent 1px)`,
        backgroundSize: '108px 108px',
      }}
    />
    <Shaft x={300} y={-300} angle={12} width={520} length={1500} opacity={0.1} />
    {/* she is standing in front of the numbers, back to camera */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1180,
        height: 740,
        background: `radial-gradient(46% 60% at 50% 100%, ${D.ice}1F 0%, transparent 70%)`,
      }}
    />
    <Figure x={392} y={1210} scale={1.0} pose="stand" tone="#101A22" litFrom="left" />
    <Dust count={18} seed={11} />
  </Cam>
);

const Text5: React.FC = () => (
  <>
    <Slug text="THE MECHANISM" at={4} />
    <Bar label="INTEREST BILLED EACH MONTH" value="$175" w={1} color={D.red} at={8} top={640} />
    <Bar
      label="WHAT SHE PAID EACH MONTH"
      value="$150"
      w={0.857}
      color="#E8E4DC"
      at={34}
      top={890}
    />
    <Caption text="THE INTEREST BILLED MORE THAN SHE PAID." at={46} size={56} />
  </>
);

// ── shot 6: the gap, capitalised ─────────────────────────────────────────────

const Scene6: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.06} to={1.15} seed={6}>
      <Room tint="#170F12" />
      <Shaft
        x={480}
        y={-300}
        angle={0}
        width={420}
        length={1500}
        opacity={0.18}
        color={D.red}
      />
      {new Array(25).fill(0).map((_, i) => {
        const at = 4 + i * 1.6;
        const p = interpolate(frame, [at, at + 34], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        });
        const x = 180 + rnd(i, 21) * 700;
        const y = 1240 - p * 560;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 22,
              height: 22,
              background: D.amberHot,
              opacity: (1 - p) * 0.95,
              boxShadow: `0 0 22px ${D.amber}`,
            }}
          />
        );
      })}
      <Dust count={18} seed={13} />
    </Cam>
  );
};

const Text6: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Readout
        label="BALANCE"
        value={money(count(frame, 6, 52, 31765, 31790))}
        at={6}
        color={D.red}
        y={560}
      />
      <Caption text="THE $25 DIFFERENCE WAS ADDED BACK." at={22} size={58} />
    </>
  );
};

// ── shot 7: the verdict ──────────────────────────────────────────────────────

const Scene7: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} from={1.02} to={1.12} seed={7}>
      <Room tint="#0C141B" />
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 380,
          width: 820,
          height: 820,
          borderRadius: '50%',
          background: `radial-gradient(60% 60% at 40% 32%, #2C3841 0%, #0B1015 78%)`,
          boxShadow: `inset 0 0 120px #000, 0 0 200px ${D.amber}33`,
          transform: `rotate(${frame * 0.12}deg)`,
        }}
      >
        {new Array(8).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 404,
              top: 60,
              width: 12,
              height: 700,
              background: '#0A0F13',
              opacity: 0.8,
              transform: `rotate(${i * 22.5}deg)`,
              transformOrigin: 'center center',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 310,
            top: 310,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(50% 50% at 40% 35%, #44515B, #0C1116)`,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 260,
          height: 1100,
          background: `radial-gradient(38% 38% at 52% 44%, ${D.amber}44 0%, transparent 72%)`,
        }}
      />
      <Figure x={390} y={820} scale={1.05} pose="lean" tone="#16202A" litFrom="right" />
      <Dust count={26} seed={17} />
    </Cam>
  );
};

const Text7: React.FC = () => (
  <Caption
    text="SHE WAS NEVER REPAYING A LOAN. SHE WAS RENTING MONEY."
    at={6}
    size={54}
    color={D.amberHot}
  />
);

// ── shot 8: the fix, stamped ─────────────────────────────────────────────────

const Scene8: React.FC<{dur: number}> = ({dur}) => (
  <Cam dur={dur} from={1.1} to={1.02} seed={8}>
    <AbsoluteFill style={{background: D.black}} />
    <Shaft x={470} y={-400} angle={0} width={520} length={1500} opacity={0.12} />
    <Dust count={16} seed={19} />
  </Cam>
);

const Text8: React.FC = () => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const o = (at: number) =>
    interpolate(frame, [at, at + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 84px'}}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 26,
          letterSpacing: 8,
          color: D.ice,
          opacity: o(2),
        }}
      >
        THE CONTRACT THAT ENDS IT
      </div>
      <div
        style={{
          height: 2,
          background: D.amber,
          width: `${rule * 100}%`,
          margin: '26px 0 30px',
          opacity: 0.7,
        }}
      />
      <div
        style={{
          fontSize: 124,
          fontWeight: 700,
          letterSpacing: -4,
          color: '#F2EFE9',
          opacity: o(10),
        }}
      >
        QARD HASAN
      </div>
      <div style={{fontSize: 48, color: D.amberHot, marginTop: 18, opacity: o(20)}}>
        Borrow 30,000. Repay 30,000. A loan earns nothing — ever.
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 28,
          letterSpacing: 5,
          color: D.steel,
          marginTop: 46,
          opacity: o(30),
        }}
      >
        PART 15 · THE MONEY MACHINE, DECODED
      </div>
    </AbsoluteFill>
  );
};

// ── film ─────────────────────────────────────────────────────────────────────

const SHOTS: {
  scene: React.FC<{dur: number}>;
  text: React.FC;
  dur: number;
}[] = [
  {scene: Scene1, text: Text1, dur: 72},
  {scene: Scene2, text: Text2, dur: 94},
  {scene: Scene3, text: Text3, dur: 90},
  {scene: Scene4, text: Text4, dur: 54},
  {scene: Scene5, text: Text5, dur: 102},
  {scene: Scene6, text: Text6, dur: 74},
  {scene: Scene7, text: Text7, dur: 60},
  {scene: Scene8, text: Text8, dur: 54},
]; // 600 frames = 20.0s @ 30fps

export const DOSSIER_FRAMES = SHOTS.reduce((n, s) => n + s.dur, 0);

/** A short dip on every cut — the genre never dissolves. */
const Cut: React.FC<{children: React.ReactNode; dur: number}> = ({children, dur}) => {
  const frame = useCurrentFrame();
  const o = Math.min(
    interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [dur - 3, dur], [1, 0.6], {extrapolateLeft: 'clamp'}),
  );
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const at = (i: number) => SHOTS.slice(0, i).reduce((n, s) => n + s.dur, 0);

export const Dossier: React.FC = () => (
  <AbsoluteFill style={{background: D.black, fontFamily: FONT}}>
    {/* footage */}
    {SHOTS.map((s, i) => (
      <Sequence key={`f${i}`} from={at(i)} durationInFrames={s.dur}>
        <Cut dur={s.dur}>
          <s.scene dur={s.dur} />
        </Cut>
      </Sequence>
    ))}
    {/* grade sits on the footage, never on the type */}
    <Grade />
    {/* narration + readouts */}
    {SHOTS.map((s, i) => (
      <Sequence key={`t${i}`} from={at(i)} durationInFrames={s.dur}>
        <s.text />
      </Sequence>
    ))}
  </AbsoluteFill>
);
