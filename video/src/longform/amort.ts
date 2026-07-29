// The worked example that runs through the whole episode.
// £250,000 · 5% APR · 25 years — figures locked to the storyboard.
export const P = 250000;
export const RATE = 0.05 / 12;
export const N = 300;

export const MONTHLY = 1461; // storyboard figure; the schedule below reproduces it

export type Row = {month: number; interest: number; principal: number; balance: number};

export const schedule = (): Row[] => {
  const rows: Row[] = [];
  let balance = P;
  for (let m = 1; m <= N; m++) {
    const interest = balance * RATE;
    const principal = Math.min(MONTHLY - interest, balance);
    balance = Math.max(0, balance - principal);
    rows.push({month: m, interest, principal, balance});
  }
  return rows;
};

export const ROWS = schedule();

/** Cumulative interest + principal up to (and including) a month. */
export const cumulative = (upTo: number) => {
  let interest = 0;
  let principal = 0;
  for (let i = 0; i < Math.min(upTo, ROWS.length); i++) {
    interest += ROWS[i].interest;
    principal += ROWS[i].principal;
  }
  return {interest, principal, paid: interest + principal};
};

// Canonical figures from the storyboard — these are what the VO says out loud,
// so they win over the schedule's own rounding.
export const CANON = {
  payment: 1461,
  m1Interest: 1042,
  m1Principal: 420,
  year1Total: 17538,
  year1Interest: 12383,
  paid10y: 175377,
  owed10y: 184811,
  totalInterest: 188443,
  totalPaid: 438443,
  murabahaPrice: 290000,
};

export const gbp = (n: number, decimals = 0) =>
  '£' +
  Math.round(n).toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
