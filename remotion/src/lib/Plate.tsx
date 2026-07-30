import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

/** A full-frame plate from public/plates. */
export const Plate: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <Img
    src={staticFile(`plates/${name}.png`)}
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
  />
);

/**
 * Wraps children in a scale/translate transform. Used for every Ken Burns move so the
 * plate and anything locked to it (a counter over a phone screen, a coin in a vault)
 * scale together instead of drifting apart.
 */
export const Camera: React.FC<{
  scale?: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
}> = ({ scale = 1, x = 0, y = 0, children }) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: 'center center',
    }}
  >
    {children}
  </AbsoluteFill>
);
