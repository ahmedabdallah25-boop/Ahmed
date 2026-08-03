import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {count, punch, reveal} from '../motion';

// "Is Klarna Halal?" palette — carried over from the Adobe Express build of
// this Short so the two stay the same film. Deliberately not theme.ts's gold:
// this episode is cream paper and terracotta, not the Deen & Dinar gold.
export const K = {
  bg: '#0A0C10',
  cream: '#E8DCC8',
  creamMid: '#D8CBB2',
  creamDeep: '#C9BEA6',
  ink: '#F5F0E6',
  dim: '#949BA6',
  terra: '#E85F42',
  slab: '#15181E',
  stroke: '#262B33',
  figInk: '#2A2620',
  label: '#7A7266',
  bar: '#3E4650',
};

const FIG = 900;

// ── small primitives ─────────────────────────────────────────────────────────

const Label: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, at, 7);
  return (
    <div
      style={{
        position: 'absolute',
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 6,
        textTransform: 'uppercase',
        color: K.label,
        opacity: r.opacity,
        transform: r.transform,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Fig: React.FC<{
  at: number;
  size: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hit?: boolean;
}> = ({at, size, children, style, hit}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, at, 8);
  const p = hit ? punch(frame, at + 5) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        fontSize: size,
        fontWeight: FIG,
        color: K.figInk,
        textAlign: 'center',
        opacity: r.opacity,
        transform: `${r.transform} scale(${p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** A block that scales/fades in on the beat. */
const Panel: React.FC<{
  at: number;
  style: React.CSSProperties;
}> = ({at, style}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, at, 8);
  return (
    <div
      style={{
        position: 'absolute',
        background: K.cream,
        borderRadius: 30,
        opacity: r.opacity,
        transform: r.transform,
        ...style,
      }}
    />
  );
};

/** Stroke that draws itself on. `len` is the path length to march through. */
const draw = (frame: number, at: number, dur: number, len: number) => ({
  strokeDasharray: len,
  strokeDashoffset: interpolate(frame, [at, at + dur], [len, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }),
});

const Svg: React.FC<{
  l: number;
  t: number;
  w: number;
  h: number;
  vb: string;
  children: React.ReactNode;
}> = ({l, t, w, h, vb, children}) => (
  <svg
    style={{position: 'absolute', left: l, top: t}}
    width={w}
    height={h}
    viewBox={vb}
  >
    {children}
  </svg>
);

// ── 01 · hook ────────────────────────────────────────────────────────────────

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const boxes = [220, 392, 564, 736];
  return (
    <>
      <Panel at={0} style={{left: 170, top: 360, width: 740, height: 520}} />
      <Label at={6} style={{left: 220, top: 410}}>
        Pay in 4
      </Label>
      {boxes.map((x, i) => {
        const at = 12 + i * 6;
        const r = reveal(frame, at, 7);
        return (
          <div
            key={x}
            style={{
              position: 'absolute',
              left: x,
              top: 480,
              width: 150,
              height: 110,
              background: K.creamMid,
              border: `3px solid #C4B69B`,
              borderRadius: 20,
              opacity: r.opacity,
              transform: r.transform,
            }}
          />
        );
      })}
      {boxes.map((x, i) => (
        <Fig
          key={x}
          at={14 + i * 6}
          size={38}
          style={{left: x, top: 513, width: 150}}
        >
          £22.50
        </Fig>
      ))}
      <Fig at={40} size={96} style={{left: 236, top: 690, width: 250}} hit>
        0%
      </Fig>
      <Svg l={236} t={642} w={250} h={180} vb="0 0 250 180">
        <ellipse
          cx={125}
          cy={90}
          rx={110}
          ry={72}
          fill="none"
          stroke={K.terra}
          strokeWidth={9}
          transform="rotate(-6 125 90)"
          {...draw(frame, 46, 16, 580)}
        />
      </Svg>
      <Fig
        at={44}
        size={62}
        style={{left: 520, top: 706, width: 340, fontWeight: 700, textAlign: 'left'}}
      >
        interest
      </Fig>
    </>
  );
};

// ── 02 · the structure ───────────────────────────────────────────────────────

export const Structure: React.FC = () => {
  const frame = useCurrentFrame();
  const xs = [110, 320, 530, 740];
  const q = reveal(frame, 60, 9);
  return (
    <>
      {xs.map((x, i) => (
        <Panel
          key={x}
          at={4 + i * 7}
          style={{left: x, top: 470, width: 190, height: 250}}
        />
      ))}
      {xs.map((x, i) => (
        <Fig
          key={x}
          at={8 + i * 7}
          size={48}
          style={{left: x, top: 560, width: 190}}
          hit
        >
          £22.50
        </Fig>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 790,
          width: 820,
          height: 190,
          background: K.slab,
          border: `3px dashed ${K.terra}`,
          borderRadius: 20,
          opacity: q.opacity,
          transform: q.transform,
        }}
      />
      <Fig
        at={66}
        size={64}
        style={{left: 110, top: 850, width: 820, color: K.terra}}
        hit
      >
        ?
      </Fig>
      <Label at={78} style={{left: 110, top: 1030, color: K.terra}}>
        the fifth payment
      </Label>
    </>
  );
};

// ── 03 · the fee ─────────────────────────────────────────────────────────────

export const Fee: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [430, 520, 610, 700, 820, 910];
  const slide = interpolate(frame, [26, 40], [-680, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.poly(4)),
  });
  return (
    <>
      <Label at={0} style={{left: 80, top: 360}}>
        Every sale
      </Label>
      {rows.map((y, i) => {
        const hot = y === 700;
        const r = reveal(frame, 4 + i * 4, 7);
        return (
          <div
            key={y}
            style={{
              position: 'absolute',
              left: 80,
              top: y,
              width: 620,
              height: 70,
              borderRadius: 30,
              background: hot ? K.terra : K.bar,
              opacity: hot ? 1 : r.opacity,
              transform: hot ? `translateX(${slide}px)` : r.transform,
            }}
          />
        );
      })}
      <Fig
        at={30}
        size={38}
        style={{
          left: 100,
          top: 718,
          width: 200,
          color: K.ink,
          textAlign: 'left',
          transform: `translateX(${slide}px)`,
        }}
      >
        −6%
      </Fig>
      <Label at={42} style={{left: 740, top: 718, color: K.terra, letterSpacing: 4}}>
        to Klarna
      </Label>
    </>
  );
};

// ── 04 · where it goes ───────────────────────────────────────────────────────

export const Tag: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Panel at={0} style={{left: 230, top: 400, width: 620, height: 400}} />
      <Svg l={230} t={400} w={620} h={400} vb="0 0 620 400">
        <circle cx={72} cy={70} r={26} fill={K.bg} />
      </Svg>
      <Fig at={6} size={76} style={{left: 230, top: 490, width: 620, color: '#8C8375'}}>
        £75.00
      </Fig>
      <Svg l={330} t={520} w={420} h={60} vb="0 0 420 60">
        <line
          x1={20}
          y1={30}
          x2={400}
          y2={30}
          stroke={K.terra}
          strokeWidth={10}
          {...draw(frame, 22, 8, 380)}
        />
      </Svg>
      <Fig at={32} size={104} style={{left: 230, top: 630, width: 620}} hit>
        £79.50
      </Fig>
    </>
  );
};

// ── 05 · everyone pays ───────────────────────────────────────────────────────

export const Everyone: React.FC = () => {
  const frame = useCurrentFrame();
  const tags = [
    {x: 90, y: 600, w: 150, h: 210},
    {x: 280, y: 560, w: 150, h: 250},
    {x: 470, y: 530, w: 150, h: 280},
    {x: 660, y: 570, w: 150, h: 240},
    {x: 850, y: 610, w: 140, h: 200},
  ];
  const lift = interpolate(frame, [34, 52], [0, -46], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.poly(3)),
  });
  const arrowX = [135, 325, 515, 705, 890];
  return (
    <>
      {tags.map((t, i) => {
        const r = reveal(frame, 2 + i * 5, 8);
        return (
          <div
            key={t.x}
            style={{
              position: 'absolute',
              left: t.x,
              top: t.y,
              width: t.w,
              height: t.h,
              background: K.cream,
              borderRadius: 30,
              opacity: r.opacity,
              transform: `${r.transform} translateY(${lift}px)`,
            }}
          />
        );
      })}
      {arrowX.map((x, i) => (
        <Svg key={x} l={x} t={458} w={60} h={102} vb="0 0 60 102">
          <path
            d="M30 102 L30 2 M0 34 L30 0 L60 34"
            fill="none"
            stroke={K.terra}
            strokeWidth={9}
            {...draw(frame, 36 + i * 3, 10, 200)}
          />
        </Svg>
      ))}
    </>
  );
};

// ── 06 · the cash buyer ──────────────────────────────────────────────────────

export const Cash: React.FC = () => {
  const frame = useCurrentFrame();
  const notes = [
    {x: 150, y: 430, c: K.creamDeep},
    {x: 180, y: 470, c: '#DCD0B8'},
    {x: 210, y: 510, c: K.cream},
  ];
  const slam = punch(frame, 92);
  const r = reveal(frame, 88, 8);
  return (
    <>
      {notes.map((n, i) => {
        const rr = reveal(frame, 4 + i * 8, 9);
        return (
          <div
            key={n.x}
            style={{
              position: 'absolute',
              left: n.x,
              top: n.y,
              width: 480,
              height: 190,
              background: n.c,
              borderRadius: 16,
              opacity: rr.opacity,
              transform: rr.transform,
            }}
          />
        );
      })}
      <Label at={30} style={{left: 250, top: 585}}>
        Cash
      </Label>
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: 820,
          width: 680,
          height: 160,
          background: K.slab,
          border: `3px solid ${K.terra}`,
          borderRadius: 20,
          opacity: r.opacity,
          transform: `${r.transform} scale(${slam})`,
        }}
      />
      <Fig
        at={92}
        size={34}
        style={{
          left: 250,
          top: 865,
          width: 180,
          height: 70,
          lineHeight: '70px',
          background: K.terra,
          color: K.ink,
          borderRadius: 14,
        }}
      >
        LATE FEE
      </Fig>
      <Fig
        at={96}
        size={62}
        style={{left: 470, top: 862, width: 380, color: K.ink, textAlign: 'left'}}
        hit
      >
        £6.00
      </Fig>
    </>
  );
};

// ── 07 · the actual product ──────────────────────────────────────────────────

export const Basket: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    {x: 300, y: 700, w: 200, h: 110, c: K.cream, at: 40},
    {x: 530, y: 700, w: 180, h: 110, c: K.creamDeep, at: 52},
    {x: 340, y: 840, w: 330, h: 110, c: K.creamMid, at: 64},
  ];
  return (
    <>
      <Svg l={240} t={560} w={600} h={460} vb="0 0 600 460">
        <path
          d="M40 120 L560 120 L500 430 L100 430 Z"
          fill="none"
          stroke={K.cream}
          strokeWidth={10}
          strokeLinejoin="round"
          {...draw(frame, 2, 20, 1500)}
        />
        {/* Shallow arc (ry 55, peaking at y=20) so the handle stays inside the
            viewBox — a true semicircle here peaks at y=-55 and gets clipped. */}
        <path
          d="M190 120 L190 75 A110 55 0 0 1 410 75 L410 120"
          fill="none"
          stroke={K.cream}
          strokeWidth={10}
          {...draw(frame, 14, 14, 400)}
        />
      </Svg>
      {items.map((it) => {
        const r = reveal(frame, it.at, 9);
        const drop = interpolate(frame, [it.at, it.at + 9], [-180, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.poly(4)),
        });
        return (
          <div
            key={it.x}
            style={{
              position: 'absolute',
              left: it.x,
              top: it.y,
              width: it.w,
              height: it.h,
              background: it.c,
              borderRadius: 12,
              opacity: r.opacity,
              transform: `translateY(${drop}px)`,
            }}
          />
        );
      })}
      <Fig
        at={78}
        size={56}
        style={{
          left: 640,
          top: 430,
          width: 280,
          height: 96,
          lineHeight: '96px',
          background: K.terra,
          color: K.ink,
          borderRadius: 14,
        }}
        hit
      >
        +{Math.round(count(frame, 78, 20, 0, 41))}%
      </Fig>
      <Label at={92} style={{left: 640, top: 545, color: K.terra}}>
        average basket
      </Label>
    </>
  );
};

// ── 08 · the rule ────────────────────────────────────────────────────────────

export const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  // The stamp lands hard, then everything goes dead still — the scene is about
  // a price that stops moving, so the motion has to stop too.
  const stamp = interpolate(frame, [40, 50], [1.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.poly(5)),
  });
  const so = interpolate(frame, [40, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <>
      <Panel at={0} style={{left: 190, top: 430, width: 700, height: 460}} />
      <Label at={6} style={{left: 240, top: 490}}>
        The sale
      </Label>
      <Fig at={12} size={130} style={{left: 190, top: 570, width: 700}}>
        £75.00
      </Fig>
      <div
        style={{
          position: 'absolute',
          left: 340,
          top: 730,
          width: 400,
          height: 130,
          opacity: so,
          transform: `scale(${stamp})`,
        }}
      >
        <svg width={400} height={130} viewBox="0 0 400 130">
          <rect
            x={8}
            y={8}
            width={384}
            height={114}
            rx={14}
            fill="none"
            stroke={K.terra}
            strokeWidth={9}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
            fontWeight: FIG,
            letterSpacing: 8,
            color: K.terra,
          }}
        >
          LOCKED
        </div>
      </div>
    </>
  );
};

// ── 09 · murabaha ────────────────────────────────────────────────────────────

export const Murabaha: React.FC = () => {
  const frame = useCurrentFrame();
  const slab = (at: number, left: number, hot: boolean) => {
    const r = reveal(frame, at, 8);
    return {
      position: 'absolute' as const,
      left,
      top: 430,
      width: 400,
      height: 170,
      background: K.slab,
      border: `3px solid ${hot ? K.terra : K.stroke}`,
      borderRadius: 20,
      opacity: r.opacity,
      transform: r.transform,
    };
  };
  return (
    <>
      <div style={slab(0, 80, false)} />
      <Label at={4} style={{left: 120, top: 470}}>
        Cost
      </Label>
      <Fig at={6} size={64} style={{left: 80, top: 510, width: 400, color: K.ink}}>
        £60
      </Fig>
      <Fig at={16} size={72} style={{left: 500, top: 500, width: 80, color: K.terra}}>
        +
      </Fig>
      <div style={slab(22, 600, true)} />
      <Label at={26} style={{left: 640, top: 470, color: K.terra}}>
        Markup
      </Label>
      <Fig at={28} size={64} style={{left: 600, top: 510, width: 400, color: K.ink}}>
        £15
      </Fig>
      <Panel at={46} style={{left: 80, top: 680, width: 920, height: 220}} />
      <Label at={52} style={{left: 130, top: 730}}>
        One price, fixed at the sale
      </Label>
      <Fig at={56} size={104} style={{left: 80, top: 775, width: 920}} hit>
        £{Math.round(count(frame, 56, 16, 60, 75))}
      </Fig>
    </>
  );
};

// ── 10 · same shape, built wrong ─────────────────────────────────────────────

export const Wrong: React.FC = () => {
  const frame = useCurrentFrame();
  const crack = 'M300 440 L286 356 L322 292 L292 214 L318 140 L296 62 L308 0';
  return (
    <>
      <Panel at={0} style={{left: 230, top: 440, width: 620, height: 440}} />
      <Fig at={4} size={130} style={{left: 230, top: 590, width: 620, color: '#8C8375'}}>
        £75.00
      </Fig>
      <Svg l={230} t={440} w={620} h={440} vb="0 0 620 440">
        <path
          d={crack}
          fill="none"
          stroke={K.bg}
          strokeWidth={16}
          strokeLinejoin="round"
          {...draw(frame, 18, 22, 520)}
        />
        <path
          d={crack}
          fill="none"
          stroke={K.terra}
          strokeWidth={6}
          strokeLinejoin="round"
          {...draw(frame, 18, 22, 520)}
        />
      </Svg>
    </>
  );
};

// ── 11 · the close ───────────────────────────────────────────────────────────

export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Svg l={290} t={420} w={500} h={360} vb="0 0 500 360">
        <ellipse
          cx={250}
          cy={180}
          rx={220}
          ry={150}
          fill="none"
          stroke={K.terra}
          strokeWidth={10}
          transform="rotate(-5 250 180)"
          {...draw(frame, 8, 20, 1180)}
        />
      </Svg>
      <Fig at={2} size={150} style={{left: 290, top: 520, width: 500, color: K.ink}} hit>
        0%
      </Fig>
      <Label
        at={30}
        style={{left: 290, top: 820, width: 500, textAlign: 'center', color: K.terra}}
      >
        is never zero
      </Label>
    </>
  );
};

export const GRAPHICS: Record<string, React.FC> = {
  hook: Hook,
  structure: Structure,
  fee: Fee,
  tag: Tag,
  everyone: Everyone,
  cash: Cash,
  basket: Basket,
  rule: Rule,
  murabaha: Murabaha,
  wrong: Wrong,
  close: Close,
};
