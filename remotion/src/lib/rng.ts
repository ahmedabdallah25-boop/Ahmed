/**
 * mulberry32 — the same deterministic PRNG the plate generator uses.
 *
 * Everything scattered in this project (coins, dust, particles) goes through this
 * rather than `i * k % n`, which bands into visible diagonal stripes. Seeded, so a
 * given frame renders identically on every machine and every re-render — Remotion
 * renders frames out of order and in parallel, so non-deterministic randomness would
 * flicker.
 */
export const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** n deterministic values in [0,1) from one seed. */
export const noise = (seed: number, n: number): number[] => {
  const r = rng(seed);
  return Array.from({ length: n }, () => r());
};
