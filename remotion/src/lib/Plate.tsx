import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { useOrientation } from '../theme';

/**
 * A full-frame plate for the current orientation. Each orientation has its own set under
 * public/plates/<orientation>/ — they are separately composed, not one set scaled.
 */
export const Plate: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => {
  const orientation = useOrientation();
  return (
    <Img
      src={staticFile(`plates/${orientation}/${name}.png`)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
    />
  );
};

/** Same, for the transparent foreground layers that need explicit geometry. */
export const usePlate = (name: string) => {
  const orientation = useOrientation();
  return staticFile(`plates/${orientation}/${name}.png`);
};

/**
 * A resolver for components that need several plates inside a loop — one hook call
 * instead of calling usePlate per iteration, which would be a hook in a loop.
 */
export const usePlateResolver = () => {
  const orientation = useOrientation();
  return (name: string) => staticFile(`plates/${orientation}/${name}.png`);
};

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
