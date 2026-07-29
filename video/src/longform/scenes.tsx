import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CANON, ROWS, cumulative, gbp} from './amort';
import {
  Amortisation,
  FlowDiagram,
  OwnershipProgress,
  PaidVsOwed,
  SharedOwnership,
} from './charts';
import {Body, Counter, H1, Kicker, L, Panel, Scene, Tick, ease, rise} from './ui';

type S = {dur: number};
/** Beat helper — scene-relative fraction, so re-timing to the VO is one number. */
const b = (dur: number, f: number) => Math.round(dur * f);

// ── 1 · COLD OPEN ────────────────────────────────────────────────────────────
export const S1: React.FC<S> = ({dur}) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [1, 1.08], {extrapolateRight: 'clamp'});
  const r0 = ROWS[0];
  return (
    <Scene dur={dur}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${push})`,
        }}
      >
        <div style={{fontFamily: 'monospace', width: 1200}}>
          <div
            style={{
              ...rise(frame, b(dur, 0.02), 24),
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 30,
              letterSpacing: 4,
              color: L.dim,
              borderBottom: `2px solid ${L.line}`,
              paddingBottom: 18,
            }}
          >
            <span>MONTH</span>
            <span>INTEREST</span>
            <span>BUYS THE HOUSE</span>
          </div>
          <div
            style={{
              ...rise(frame, b(dur, 0.12), 24),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: 76,
              fontWeight: 700,
              marginTop: 34,
            }}
          >
            <span style={{color: L.dim}}>1</span>
            <span style={{color: L.red}}>{gbp(CANON.m1Interest)}</span>
            <span style={{color: L.ink}}>{gbp(CANON.m1Principal)}</span>
          </div>
          <div
            style={{
              ...rise(frame, b(dur, 0.45), 20),
              marginTop: 40,
              fontSize: 38,
              color: L.dim,
              letterSpacing: 2,
            }}
          >
            PAYMENT {gbp(CANON.payment)} · 71% OF IT IS RENT ON MONEY
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ── 2 · THE STAKE ────────────────────────────────────────────────────────────
export const S2: React.FC<S> = ({dur}) => {
  const frame = useCurrentFrame();
  const tallyEnd = b(dur, 0.45);
  const months = Math.round(ease(frame, b(dur, 0.05), tallyEnd) * 300);
  const cum = cumulative(months);
  const showBars = frame > b(dur, 0.5);
  return (
    <Scene dur={dur}>
      {!showBars ? (
        <>
          <Kicker>The full term</Kicker>
          <div style={{display: 'flex', gap: 80, alignItems: 'flex-start'}}>
            <div style={{fontFamily: 'monospace', flex: 1}}>
              {ROWS.slice(Math.max(0, months - 8), Math.max(8, months)).map((r) => (
                <div
                  key={r.month}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 34,
                    padding: '10px 0',
                    borderBottom: `1px solid ${L.line}`,
                    opacity: 0.3 + (r.month / Math.max(1, months)) * 0.7,
                  }}
                >
                  <span style={{color: L.dim}}>#{r.month}</span>
                  <span style={{color: L.red}}>{gbp(r.interest)}</span>
                  <span>{gbp(r.principal)}</span>
                </div>
              ))}
            </div>
            <div style={{width: 700}}>
              <div style={{fontSize: 32, letterSpacing: 4, color: L.dim, fontWeight: 700}}>
                TOTAL INTEREST PAID
              </div>
              <Counter
                to={cum.interest}
                at={0}
                dur={1}
                from={cum.interest}
                format={(n) => gbp(n)}
                size={132}
                color={L.red}
              />
              <div style={{fontSize: 34, color: L.dim, marginTop: 20}}>
                over {months} of 300 payments
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Kicker>After 10 years · 120 payments · never missed</Kicker>
          <PaidVsOwed at={b(dur, 0.52)} paid={CANON.paid10y} owed={CANON.owed10y} />
          <H1 at={b(dur, 0.78)} size={64} color={L.gold} style={{marginTop: 20}}>
            {gbp(CANON.totalInterest)} of interest over the term. That is a second house —
            you just don&rsquo;t get to live in it.
          </H1>
        </>
      )}
    </Scene>
  );
};

// ── 3 · THE PROMISE ──────────────────────────────────────────────────────────
export const S3: React.FC<S> = ({dur}) => {
  const cards = [
    ['1', 'WHY IT&rsquo;S BUILT THIS WAY', 'The mechanism behind the schedule'],
    ['2', 'THE THREE HALAL STRUCTURES', 'Murabaha · Ijara · Diminishing Musharaka'],
    ['3', 'HOW TO SPOT A FAKE', 'Four questions — the fourth is the one nobody asks'],
  ];
  return (
    <Scene dur={dur}>
      <Kicker>In the next twelve minutes</Kicker>
      <div style={{display: 'flex', gap: 34, marginTop: 40}}>
        {cards.map(([n, t, s], i) => (
          <Panel
            key={i}
            at={b(dur, 0.12) + i * 22}
            accent={L.gold}
            style={{flex: 1, minHeight: 420}}
          >
            <div style={{fontSize: 90, fontWeight: 700, color: L.gold}}>{n}</div>
            <div
              style={{fontSize: 46, fontWeight: 700, marginTop: 20, lineHeight: 1.1}}
              dangerouslySetInnerHTML={{__html: t}}
            />
            <div style={{fontSize: 30, color: L.dim, marginTop: 18}}>{s}</div>
          </Panel>
        ))}
      </div>
    </Scene>
  );
};

// ── 4 · WHAT A MORTGAGE ACTUALLY IS ──────────────────────────────────────────
export const S4: React.FC<S> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <Scene dur={dur}>
      <Kicker>What a conventional mortgage actually is</Kicker>
      <H1 at={b(dur, 0.04)} size={86}>
        LOAN <span style={{color: L.red}}>≠</span> SALE
      </H1>
      <div style={{marginTop: 70}}>
        <FlowDiagram
          at={b(dur, 0.12)}
          parties={[
            {label: 'BANK', color: L.grey, sub: 'lends cash'},
            {label: 'YOU', color: L.green, sub: 'buy the house'},
            {label: 'SELLER', color: L.gold, sub: 'hands over title'},
          ]}
          steps={[
            {label: 'CASH', color: L.gold},
            {label: 'PURCHASE PRICE', color: L.gold},
          ]}
        />
      </div>
      <div style={{marginTop: 60, display: 'flex', gap: 34}}>
        <Panel at={b(dur, 0.45)} accent={L.red} style={{flex: 1}}>
          <div style={{fontSize: 40, fontWeight: 700, color: L.red}}>
            A CHARGE, NOT OWNERSHIP
          </div>
          <Body at={b(dur, 0.47)} size={34} style={{marginTop: 12}}>
            The bank never owns the property. It owns a claim on you — secured
            against it.
          </Body>
        </Panel>
        <Panel at={b(dur, 0.62)} accent={L.red} style={{flex: 1}}>
          <div style={{fontSize: 40, fontWeight: 700, color: L.red}}>
            THE RISK STAYS WITH YOU
          </div>
          <Body at={b(dur, 0.64)} size={34} style={{marginTop: 12}}>
            Roof fails, market collapses, building burns down uninsured — you
            still owe every penny.
          </Body>
        </Panel>
        <Panel at={b(dur, 0.78)} accent={L.red} style={{flex: 1}}>
          <div style={{fontSize: 40, fontWeight: 700, color: L.red}}>
            THE CLAIM GROWS ANYWAY
          </div>
          <Body at={b(dur, 0.8)} size={34} style={{marginTop: 12}}>
            Money lent, more money back. No ownership and no risk taken in
            between.
          </Body>
        </Panel>
      </div>
      <div
        style={{
          ...rise(frame, b(dur, 0.9), 16),
          marginTop: 56,
          fontSize: 44,
          color: L.gold,
          fontWeight: 700,
        }}
      >
        That is the definition. Not the marketing — the mechanism.
      </div>
    </Scene>
  );
};

// ── 5 · WHY THE EARLY YEARS ARE BRUTAL ───────────────────────────────────────
export const S5: React.FC<S> = ({dur}) => (
  <Scene dur={dur}>
    <Kicker>Interest is charged on what you still owe</Kicker>
    <H1 at={b(dur, 0.03)} size={78}>
      YEAR 1: <span style={{color: L.red}}>71% INTEREST</span>
    </H1>
    <div style={{marginTop: 56}}>
      <Amortisation at={b(dur, 0.1)} dur={b(dur, 0.72)} markYear={13} height={330} />
    </div>
    <div style={{display: 'flex', gap: 34, marginTop: 96}}>
      <Panel at={b(dur, 0.55)} accent={L.red} style={{flex: 1}}>
        <Body size={36} color={L.ink}>
          Year one: {gbp(CANON.year1Total)} leaves your account. {gbp(CANON.year1Interest)} of it is
          interest.
        </Body>
      </Panel>
      <Panel at={b(dur, 0.75)} accent={L.gold} style={{flex: 1}}>
        <Body size={36} color={L.ink}>
          The crossover — more of your payment buying the house than renting the
          money — arrives in year 13. Remortgage and the clock resets.
        </Body>
      </Panel>
    </div>
  </Scene>
);

// ── 6 · THE PRINCIPLE ────────────────────────────────────────────────────────
export const S6: React.FC<S> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <Scene dur={dur}>
      <AbsoluteFill style={{justifyContent: 'center', padding: 128}}>
        <div
          style={{
            ...rise(frame, b(dur, 0.05), 30),
            fontSize: 76,
            fontFamily: '"FreeSerif", "DejaVu Sans", serif',
            direction: 'rtl',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا
        </div>
        <div
          style={{
            ...rise(frame, b(dur, 0.22), 26),
            fontSize: 52,
            textAlign: 'center',
            marginTop: 40,
            color: L.ink,
          }}
        >
          &ldquo;Allah has permitted trade and forbidden riba.&rdquo;
        </div>
        <div
          style={{
            ...rise(frame, b(dur, 0.28), 20),
            fontSize: 32,
            textAlign: 'center',
            marginTop: 18,
            color: L.dim,
            letterSpacing: 4,
          }}
        >
          AL-BAQARAH 2:275
        </div>
        <div style={{display: 'flex', gap: 40, marginTop: 90}}>
          <Panel at={b(dur, 0.5)} accent={L.green} style={{flex: 1}}>
            <div style={{fontSize: 44, fontWeight: 700, color: L.green, letterSpacing: 4}}>
              TRADE
            </div>
            <Body at={b(dur, 0.52)} size={38} color={L.ink} style={{marginTop: 14}}>
              You own something. You carry the risk of owning it. You profit if
              it goes well.
            </Body>
          </Panel>
          <Panel at={b(dur, 0.68)} accent={L.red} style={{flex: 1}}>
            <div style={{fontSize: 44, fontWeight: 700, color: L.red, letterSpacing: 4}}>
              RIBA
            </div>
            <Body at={b(dur, 0.7)} size={38} color={L.ink} style={{marginTop: 14}}>
              You part with money. You carry no risk. Your return is guaranteed
              in advance.
            </Body>
          </Panel>
        </div>
        <div
          style={{
            ...rise(frame, b(dur, 0.85), 18),
            marginTop: 60,
            textAlign: 'center',
            fontSize: 46,
            fontWeight: 700,
            color: L.gold,
            letterSpacing: 6,
          }}
        >
          OWNERSHIP · RISK
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ── shared structure layout for scenes 7–9 ───────────────────────────────────
const Structure: React.FC<{
  dur: number;
  n: string;
  name: string;
  sub: string;
  children: React.ReactNode;
  tradeoff: string;
  accent?: string;
}> = ({dur, n, name, sub, children, tradeoff, accent = L.green}) => {
  const frame = useCurrentFrame();
  return (
    <Scene dur={dur}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
        <span style={{...rise(frame, 0, 10), fontSize: 34, color: accent, fontWeight: 700, letterSpacing: 4}}>
          STRUCTURE {n}
        </span>
        <span style={{...rise(frame, 4, 10), fontSize: 34, color: L.dim}}>{sub}</span>
      </div>
      <H1 at={8} size={92} color={L.ink} style={{marginTop: 14}}>
        {name}
      </H1>
      <div style={{marginTop: 60, flex: 1}}>{children}</div>
      <Panel at={b(dur, 0.84)} accent={L.gold} style={{marginTop: 40}}>
        <div style={{fontSize: 30, letterSpacing: 4, color: L.gold, fontWeight: 700}}>
          THE TRADE-OFF
        </div>
        <Body at={b(dur, 0.86)} size={36} color={L.ink} style={{marginTop: 10}}>
          {tradeoff}
        </Body>
      </Panel>
    </Scene>
  );
};

// ── 7 · MURABAHA ─────────────────────────────────────────────────────────────
export const S7: React.FC<S> = ({dur}) => {
  const frame = useCurrentFrame();
  const steps = [
    ['1', 'BANK BUYS THE PROPERTY', 'Title, risk, the lot — the bank actually owns it'],
    ['2', 'BANK SELLS IT TO YOU', 'Cost + a markup, disclosed openly at signing'],
    ['3', 'YOU PAY IN INSTALMENTS', 'Identical payments — a price, not a balance'],
  ];
  return (
    <Structure
      dur={dur}
      n="ONE"
      name="MURABAHA"
      sub="cost-plus sale"
      tradeoff="Rigidity. A fixed price cuts both ways — settle early and you may not save much, because you owe a price, not an interest-bearing balance."
    >
      <div style={{display: 'flex', gap: 30}}>
        {steps.map(([n, t, s], i) => (
          <Panel key={i} at={b(dur, 0.12) + i * 26} accent={L.green} style={{flex: 1, minHeight: 300}}>
            <div style={{fontSize: 44, fontWeight: 700, color: L.green}}>{n}</div>
            <div style={{fontSize: 42, fontWeight: 700, marginTop: 16, lineHeight: 1.1}}>{t}</div>
            <div style={{fontSize: 30, color: L.dim, marginTop: 14}}>{s}</div>
          </Panel>
        ))}
      </div>
      <div
        style={{
          ...rise(frame, b(dur, 0.62), 18),
          marginTop: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <span style={{fontSize: 34, letterSpacing: 4, color: L.dim, fontWeight: 700}}>
          PRICE FIXED AT SIGNING
        </span>
        <span style={{fontSize: 72, fontWeight: 700, color: L.green}}>{gbp(CANON.murabahaPrice)}</span>
        <span style={{fontSize: 34, color: L.dim}}>
          — no compounding, because there is no loan to compound
        </span>
      </div>
    </Structure>
  );
};

// ── 8 · IJARA WA IQTINA ──────────────────────────────────────────────────────
export const S8: React.FC<S> = ({dur}) => (
  <Structure
    dur={dur}
    n="TWO"
    name="IJARA WA IQTINA"
    sub="a lease that ends in ownership"
    tradeoff="Rent can be reviewed. A poorly written Ijara reprices against a benchmark — and if that benchmark is just the base rate under another name, you have re-created the thing you were avoiding."
  >
    <div style={{marginTop: 10}}>
      <OwnershipProgress at={b(dur, 0.1)} dur={b(dur, 0.62)} />
    </div>
    <div style={{display: 'flex', gap: 34, marginTop: 60}}>
      <Panel at={b(dur, 0.3)} accent={L.green} style={{flex: 1}}>
        <Body size={36} color={L.ink}>
          The bank buys the property and holds the title. It leases it to you —
          rent for the use of an asset someone else owns.
        </Body>
      </Panel>
      <Panel at={b(dur, 0.5)} accent={L.green} style={{flex: 1}}>
        <Body size={36} color={L.ink}>
          Because it holds the title, it holds the obligations: structural
          insurance, major repairs, and the loss if the building is destroyed.
        </Body>
      </Panel>
    </div>
  </Structure>
);

// ── 9 · DIMINISHING MUSHARAKA ────────────────────────────────────────────────
export const S9: React.FC<S> = ({dur}) => (
  <Structure
    dur={dur}
    n="THREE"
    name="DIMINISHING MUSHARAKA"
    sub="shared, shrinking partnership"
    tradeoff="Rent is reviewable here too — but your exposure to it shrinks every month, and ownership is real and on the register from day one."
  >
    <SharedOwnership at={b(dur, 0.1)} dur={b(dur, 0.7)} />
  </Structure>
);

// ── 10 · SIDE BY SIDE ────────────────────────────────────────────────────────
export const S10: React.FC<S> = ({dur}) => {
  const frame = useCurrentFrame();
  const cols = ['', 'CONVENTIONAL', 'MURABAHA', 'IJARA', 'MUSHARAKA'];
  const rows: (string | boolean)[][] = [
    ['Bank owns property', false, true, true, true],
    ['Total cost fixed', false, true, false, false],
    ['Cost falls over time', false, false, false, true],
    ['Early settlement', 'Saves interest', 'Limited', 'Flexible', 'Flexible'],
    ['Who bears total loss', 'You', 'Bank pre-sale', 'Bank', 'Both, pro rata'],
  ];
  return (
    <Scene dur={dur}>
      <Kicker>All three, side by side</Kicker>
      <div style={{marginTop: 30}}>
        <div style={{display: 'flex', borderBottom: `2px solid ${L.line}`, paddingBottom: 20}}>
          {cols.map((c, i) => (
            <div
              key={i}
              style={{
                flex: i === 0 ? 1.6 : 1,
                fontSize: 30,
                letterSpacing: 3,
                fontWeight: 700,
                color: i === 1 ? L.red : i === 0 ? L.dim : L.green,
              }}
            >
              {c}
            </div>
          ))}
        </div>
        {rows.map((r, ri) => {
          const at = b(dur, 0.08) + ri * b(dur, 0.15);
          const rr = rise(frame, at, 14);
          return (
            <div
              key={ri}
              style={{
                ...rr,
                display: 'flex',
                alignItems: 'center',
                padding: '30px 0',
                borderBottom: `1px solid ${L.line}`,
                fontSize: 38,
              }}
            >
              {r.map((cell, ci) => (
                <div key={ci} style={{flex: ci === 0 ? 1.6 : 1, color: ci === 0 ? L.dim : L.ink}}>
                  {typeof cell === 'boolean' ? (
                    <span style={{fontSize: 46}}>
                      <Tick on={cell} color={L.green} off={ci === 1 ? L.red : L.grey} />
                    </span>
                  ) : (
                    cell
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <Body at={b(dur, 0.86)} size={40} color={L.gold} style={{marginTop: 40}}>
        None of them is automatically the best. They answer different questions.
      </Body>
    </Scene>
  );
};

// ── 11 · THE FOUR QUESTIONS ──────────────────────────────────────────────────
export const S11: React.FC<S> = ({dur}) => {
  const qs = [
    'Does the bank take legal title?',
    'Is the profit disclosed and fixed at signing?',
    'Who pays if the property is destroyed?',
    'What happens if you pay late — and where does that money go?',
  ];
  return (
    <Scene dur={dur}>
      <Kicker color={L.red}>How to spot a fake</Kicker>
      <H1 at={6} size={80}>
        FOUR QUESTIONS
      </H1>
      <div style={{marginTop: 50}}>
        {qs.map((q, i) => {
          const last = i === 3;
          const at = b(dur, 0.1) + i * b(dur, 0.17);
          return (
            <Panel
              key={i}
              at={at}
              accent={last ? L.gold : L.green}
              style={{marginBottom: 24, display: 'flex', gap: 30, alignItems: 'center'}}
            >
              <span
                style={{
                  fontSize: 46,
                  fontWeight: 700,
                  color: last ? L.gold : L.green,
                  minWidth: 60,
                }}
              >
                {i + 1}
              </span>
              <span style={{fontSize: 46, color: last ? L.gold : L.ink}}>{q}</span>
            </Panel>
          );
        })}
      </div>
      <Body at={b(dur, 0.86)} size={36} style={{marginTop: 30}}>
        Serious scholars argue some retail products are conventional lending with
        extra steps. That criticism isn&rsquo;t unreasonable — these questions are
        how you check a specific offer instead of trusting a label.
      </Body>
    </Scene>
  );
};

// ── 12 · RECAP ───────────────────────────────────────────────────────────────
export const S12: React.FC<S> = ({dur}) => {
  const items = [
    ['MURABAHA', 'replaces the loan with a sale', L.green],
    ['IJARA', 'replaces it with a lease', L.green],
    ['MUSHARAKA', 'replaces it with a partnership that shrinks', L.green],
  ];
  return (
    <Scene dur={dur}>
      <Kicker>Recap</Kicker>
      <div style={{display: 'flex', gap: 30}}>
        {items.map(([t, s, c], i) => (
          <Panel key={i} at={b(dur, 0.08) + i * 18} accent={c} style={{flex: 1}}>
            <div style={{fontSize: 44, fontWeight: 700, color: c}}>{t}</div>
            <div style={{fontSize: 30, color: L.dim, marginTop: 12}}>{s}</div>
          </Panel>
        ))}
      </div>
      <div style={{marginTop: 70}}>
        <PaidVsOwed at={b(dur, 0.42)} paid={CANON.paid10y} owed={CANON.owed10y} />
      </div>
      <Body at={b(dur, 0.82)} size={44} color={L.gold}>
        You don&rsquo;t have to accept the {gbp(CANON.totalInterest)}. You have to know which
        of the three fits — and then ask the four questions.
      </Body>
    </Scene>
  );
};

// ── 13 · CLOSE & NEXT ────────────────────────────────────────────────────────
export const S13: React.FC<S> = ({dur}) => (
  <Scene dur={dur}>
    <AbsoluteFill style={{justifyContent: 'center', padding: 128}}>
      <Kicker>Deen &amp; Dinar · Episode 2</Kicker>
      <H1 at={8} size={78}>
        A NEW MECHANISM DECODED EVERY WEEK
      </H1>
      <div style={{display: 'flex', gap: 34, marginTop: 60}}>
        <Panel at={b(dur, 0.3)} accent={L.gold} style={{flex: 1}}>
          <div style={{fontSize: 32, letterSpacing: 4, color: L.gold, fontWeight: 700}}>
            SUBSCRIBE
          </div>
          <Body at={b(dur, 0.32)} size={36} color={L.ink} style={{marginTop: 12}}>
            No jargon, just mechanisms.
          </Body>
        </Panel>
        <Panel at={b(dur, 0.45)} accent={L.green} style={{flex: 1.4}}>
          <div style={{fontSize: 32, letterSpacing: 4, color: L.green, fontWeight: 700}}>
            NEXT EPISODE
          </div>
          <div style={{fontSize: 52, fontWeight: 700, marginTop: 12}}>
            Is Your Savings Account Haram?
          </div>
        </Panel>
      </div>
    </AbsoluteFill>
  </Scene>
);
