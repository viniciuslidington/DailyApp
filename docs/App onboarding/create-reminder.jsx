// Create-reminder flow — six screens matching the Daily design system.
// Relies on the D color tokens, PrimaryButton, GhostButton, Logo, ProgressDots
// already declared in screens.jsx (loaded before this file).

// ─── Shared chrome ────────────────────────────────────────────
function CRHeader({ step, total = 5, title, sub }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', marginBottom: 22,
      }}>
        {/* Back chevron in a soft chip */}
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: D.card,
          border: `1px solid ${D.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke={D.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontSize: 13, color: D.ink3, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          Step {step} of {total}
        </div>
        <div style={{ fontSize: 14, color: D.ink2, fontWeight: 500 }}>Cancel</div>
      </div>

      {/* progress bar */}
      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <div style={{ height: 4, background: D.track, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(step / total) * 100}%`, height: '100%',
            background: D.blue, borderRadius: 2,
            transition: 'width .3s',
          }} />
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: D.ink, letterSpacing: -0.7, marginBottom: 6 }}>{title}</div>
        {sub && <div style={{ fontSize: 15, color: D.ink2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── 1. Title ─────────────────────────────────────────────────
function CR1_Title() {
  const Quick = ({ icon, label, tint, selected }) => (
    <div style={{
      flex: 1, padding: '14px 10px', borderRadius: 14, background: D.card,
      border: `1.5px solid ${selected ? D.blue : D.hair}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, background: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: '#fff', fontWeight: 700,
      }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: selected ? D.blue : D.ink2 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <CRHeader step={1} title="What's the reminder?" sub="Give it a short, clear name." />

      <div style={{ padding: '0 24px' }}>
        <div style={{
          height: 64, borderRadius: 16, background: D.card,
          border: `1.5px solid ${D.blue}`,
          padding: '0 20px', display: 'flex', alignItems: 'center',
          fontSize: 20, fontWeight: 500, color: D.ink,
        }}>
          Important meeting
          <div style={{ width: 2, height: 24, background: D.blue, marginLeft: 2, animation: 'blink 1s infinite' }} />
        </div>

        <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, padding: '24px 4px 10px' }}>
          Or pick a type
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Quick icon="◆" label="Meeting" tint={D.blue} selected />
          <Quick icon="✦" label="Event" tint={D.orange} />
          <Quick icon="◷" label="Deadline" tint={D.purple} />
          <Quick icon="✓" label="Task" tint={D.success} />
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 2. Date & time ───────────────────────────────────────────
function CR2_When() {
  // Mini month calendar (May 2026, day 1 = Fri)
  const dim = 31;
  const startCol = 5; // 0=Sun ... 5=Fri
  const cells = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const today = 23, selected = 29; // Friday May 29

  const Cell = ({ d }) => {
    if (d === null) return <div style={{ height: 36 }} />;
    const isSel = d === selected;
    const isToday = d === today;
    return (
      <div style={{
        height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: isSel ? 600 : 500,
        color: isSel ? '#fff' : (isToday ? D.blue : D.ink),
        background: isSel ? D.blue : 'transparent',
        borderRadius: 18, fontVariantNumeric: 'tabular-nums',
      }}>{d}</div>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <CRHeader step={2} title="When is it?" sub="Pick the day and time of the event." />

      <div style={{ padding: '0 16px' }}>
        <div style={{ background: D.card, borderRadius: 20, padding: '14px 12px', border: `1px solid ${D.hair}` }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 10px 10px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: D.ink }}>May 2026</div>
            <div style={{ display: 'flex', gap: 14, color: D.ink3 }}>
              <span style={{ fontSize: 14 }}>‹</span><span style={{ fontSize: 14 }}>›</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 4px 4px' }}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: D.ink3, textTransform: 'uppercase' }}>{d}</div>
            ))}
            {cells.map((d, i) => <Cell key={i} d={d} />)}
          </div>
        </div>

        {/* Time row */}
        <div style={{
          marginTop: 12, background: D.card, borderRadius: 16, border: `1px solid ${D.hair}`,
          padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, color: D.ink2, fontWeight: 500 }}>Time</div>
            <div style={{ fontSize: 17, color: D.ink, fontWeight: 500, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>2:00 PM</div>
          </div>
          <div style={{
            padding: '8px 14px', borderRadius: 10, background: D.blueSoft,
            color: D.blue, fontSize: 14, fontWeight: 600,
          }}>Change</div>
        </div>

        {/* Summary chip */}
        <div style={{
          marginTop: 14, padding: '12px 16px', borderRadius: 14,
          background: D.orangeSoft, color: D.orangeInk,
          fontSize: 14, lineHeight: 1.4, display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4, background: D.orange, flexShrink: 0,
          }} />
          <div><b style={{ color: D.orangeInk }}>Friday, May 29</b> · in 6 days</div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 3. Notification schedule ─────────────────────────────────
function CR3_Schedule() {
  const Option = ({ title, sub, marks, selected, accent = D.blue }) => (
    <div style={{
      borderRadius: 18, background: D.card, marginBottom: 10,
      border: `1.5px solid ${selected ? accent : D.hair}`,
      padding: 16, position: 'relative',
      boxShadow: selected ? `0 6px 18px ${accent}1f` : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Radio */}
        <div style={{
          width: 22, height: 22, borderRadius: 11,
          border: `2px solid ${selected ? accent : D.mute}`,
          background: selected ? accent : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          {selected && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: D.ink, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 13, color: D.ink2, lineHeight: 1.35 }}>{sub}</div>
        </div>
      </div>
      {/* Visual timeline marks */}
      {marks && (
        <div style={{ marginTop: 14, paddingLeft: 34, paddingRight: 4, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 38, right: 8, top: 7, height: 2, background: D.track, borderRadius: 1 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {marks.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: m.event ? 14 : 8, height: m.event ? 14 : 8,
                  borderRadius: '50%',
                  background: m.event ? D.orange : (m.on ? accent : D.mute),
                  boxShadow: m.event ? `0 0 0 3px ${D.orangeSoft}` : 'none',
                }} />
                <div style={{ fontSize: 10, color: m.event ? D.orangeInk : D.ink3, fontWeight: m.event ? 600 : 500 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CRHeader step={3} title="When should we remind you?" sub="Pick a schedule that fits how urgent it feels." />

      <div style={{ padding: '0 16px', overflow: 'hidden' }}>
        <Option
          title="On the day only"
          sub="One ping at the time of the event."
          marks={[
            { label: '−3d', on: false }, { label: '−2d', on: false },
            { label: '−1d', on: false }, { label: 'Event', event: true },
          ]}
        />
        <Option
          selected
          title="3 days · 1 day · day of"
          sub="A heads-up, a reminder, and a final nudge."
          marks={[
            { label: '−3d', on: true }, { label: '−2d', on: false },
            { label: '−1d', on: true }, { label: 'Event', event: true },
          ]}
        />
        <Option
          accent={D.orange}
          title="Every day until the event"
          sub="A daily countdown — 6 reminders, ending Friday."
          marks={[
            { label: '−5', on: true }, { label: '−4', on: true },
            { label: '−3', on: true }, { label: '−2', on: true },
            { label: '−1', on: true }, { label: 'Event', event: true },
          ]}
        />
        <Option
          title="Custom…"
          sub="Choose your own combination of offsets."
        />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '12px 24px 14px' }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 4. Message ───────────────────────────────────────────────
function CR4_Message() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <CRHeader step={4} title="Customize the message" sub="This is what you'll see in your notifications." />

      <div style={{ padding: '0 24px' }}>
        {/* Notification preview */}
        <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          Preview
        </div>
        <div style={{
          background: D.glass, borderRadius: 20, padding: '14px 16px',
          boxShadow: `0 8px 24px ${D.shadowAmt}, 0 0 0 1px ${D.glassBorder}`,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: D.card,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `inset 0 0 0 1px ${D.hair}`, flexShrink: 0,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, border: `3px solid ${D.blue}` }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: D.ink }}>Daily</div>
              <div style={{ fontSize: 12, color: D.ink3 }}>Tomorrow</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: D.ink, lineHeight: 1.3, marginBottom: 2 }}>
              Important meeting in 1 day
            </div>
            <div style={{ fontSize: 13, color: D.ink2, lineHeight: 1.35 }}>
              Prep the deck and confirm the room with Sam.
            </div>
          </div>
        </div>

        {/* Message field */}
        <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: '22px 0 8px' }}>
          Message
        </div>
        <div style={{
          minHeight: 110, borderRadius: 16, background: D.card,
          border: `1.5px solid ${D.blue}`, padding: '14px 16px',
          fontSize: 15, color: D.ink, lineHeight: 1.45,
        }}>
          Prep the deck and confirm the room with Sam.<span style={{
            display: 'inline-block', width: 2, height: 18, background: D.blue,
            verticalAlign: 'middle', marginLeft: 2, animation: 'blink 1s infinite',
          }} />
        </div>

        {/* Variable chips */}
        <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: '18px 0 8px' }}>
          Add a variable
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Countdown', tint: D.blueSoft, color: D.blue },
            { label: 'Date', tint: D.blueSoft, color: D.blue },
            { label: 'Time', tint: D.blueSoft, color: D.blue },
            { label: 'Your name', tint: D.orangeSoft, color: D.orangeInk },
          ].map((c, i) => (
            <div key={i} style={{
              padding: '7px 12px', borderRadius: 999, background: c.tint, color: c.color,
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ opacity: 0.6 }}>+</span>{c.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 5. Review ────────────────────────────────────────────────
function CR5_Review() {
  const Row = ({ label, value, last }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '14px 18px',
      borderBottom: last ? 'none' : `1px solid ${D.hair}`,
    }}>
      <div style={{ fontSize: 14, color: D.ink2, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 15, color: D.ink, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <CRHeader step={5} title="Ready to set this up?" sub="Review your reminder, then save." />

      <div style={{ padding: '0 16px' }}>
        {/* Hero card */}
        <div style={{
          background: `linear-gradient(135deg, ${D.blue} 0%, ${D.blueDark} 100%)`,
          borderRadius: 22, padding: 20, color: '#fff',
          boxShadow: `0 14px 36px ${D.blue}33`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>◆</div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.85 }}>Meeting</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, marginBottom: 6 }}>Important meeting</div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>Friday, May 29 · 2:00 PM</div>
        </div>

        {/* Details list */}
        <div style={{
          marginTop: 14, background: D.card, borderRadius: 18,
          border: `1px solid ${D.hair}`, overflow: 'hidden',
        }}>
          <Row label="Schedule" value="3 days · 1 day · day of" />
          <Row label="Notifications" value="3 in total" />
          <Row label="Message" value={'"Prep the deck and confirm the room with Sam."'} last />
        </div>

        {/* Timeline ribbon */}
        <div style={{ marginTop: 14, padding: '14px 16px', background: D.card, borderRadius: 18, border: `1px solid ${D.hair}` }}>
          <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            You'll be pinged
          </div>
          <div style={{ position: 'relative', paddingBottom: 22 }}>
            <div style={{ position: 'absolute', left: 4, right: 4, top: 7, height: 2, background: D.track }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { l: 'Tue', on: true }, { l: 'Wed' }, { l: 'Thu', on: true },
                { l: 'Fri', event: true },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: m.event ? 16 : 10, height: m.event ? 16 : 10,
                    borderRadius: '50%',
                    background: m.event ? D.orange : (m.on ? D.blue : D.mute),
                    boxShadow: m.event ? `0 0 0 4px ${D.orangeSoft}` : 'none',
                  }} />
                  <div style={{ fontSize: 11, color: m.event ? D.orangeInk : D.ink3, fontWeight: 600 }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Save reminder</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 6. Created ───────────────────────────────────────────────
function CR6_Created() {
  // Home, with the new reminder highlighted at top of the list.
  const Item = ({ title, time, color = D.blue, highlight, done }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px', background: D.card, borderRadius: 18,
      border: `${highlight ? 2 : 1}px solid ${highlight ? D.blue : D.hair}`,
      boxShadow: highlight ? `0 10px 28px ${D.blue}22` : 'none',
      position: 'relative',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 13,
        background: done ? color : 'transparent',
        border: done ? 'none' : `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {done && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: done ? D.ink3 : D.ink, textDecoration: done ? 'line-through' : 'none' }}>{title}</div>
        <div style={{ fontSize: 13, color: D.ink3, marginTop: 2 }}>{time}</div>
      </div>
      {highlight && (
        <div style={{
          position: 'absolute', top: -10, right: 14,
          padding: '3px 8px', borderRadius: 999,
          background: D.blue, color: '#fff',
          fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>New</div>
      )}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 60, display: 'flex', flexDirection: 'column' }}>
      {/* Top toast */}
      <div style={{
        position: 'absolute', top: 64, left: 16, right: 16, zIndex: 10,
        background: D.card, borderRadius: 16,
        boxShadow: `0 12px 30px ${D.shadowAmt2}, 0 0 0 1px ${D.glassBorder}`,
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 16, background: D.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: D.ink }}>Reminder created</div>
          <div style={{ fontSize: 12, color: D.ink2 }}>First ping Tuesday morning.</div>
        </div>
        <div style={{ fontSize: 13, color: D.blue, fontWeight: 600 }}>Undo</div>
      </div>

      <div style={{ padding: '70px 24px 8px' }}>
        <div style={{ fontSize: 14, color: D.ink2, fontWeight: 500 }}>Saturday, May 23</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: D.ink, letterSpacing: -0.8, marginTop: 4 }}>Morning, Alex</div>
      </div>

      <div style={{ padding: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ fontSize: 13, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, padding: '4px 6px 0' }}>
          Upcoming
        </div>
        <Item highlight title="Important meeting" time="Fri, May 29 · 2:00 PM" />
        <div style={{ fontSize: 13, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, padding: '10px 6px 0' }}>
          Today
        </div>
        <Item title="Drink a glass of water" time="8:30 AM" done />
        <Item title="Stretch for two minutes" time="12:00 PM" />
      </div>

      {/* Tab bar */}
      <TabBar active="today" />
    </div>
  );
}

// ─── 3b. Custom · Pick days ───────────────────────────────────
// Step 1 of the custom flow: which days leading up to the event should fire
// notifications. The next screen (CR3c) handles times-per-day.
function CR3b_Custom() {
  // Days from today (Sat May 23) through the event (Fri May 29).
  const days = [
    { weekday: 'Sat', date: 23, label: 'Today', on: false },
    { weekday: 'Sun', date: 24, on: false },
    { weekday: 'Mon', date: 25, on: false },
    { weekday: 'Tue', date: 26, on: true },
    { weekday: 'Wed', date: 27, on: false },
    { weekday: 'Thu', date: 28, on: true },
    { weekday: 'Fri', date: 29, label: 'Event', event: true, on: true },
  ];
  const selectedCount = days.filter((d) => d.on || d.event).length;

  const Row = ({ d }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px',
      background: d.on || d.event ? D.card : 'transparent',
      borderRadius: 14,
      border: `1.5px solid ${d.event ? D.orange : (d.on ? D.blue : 'transparent')}`,
      marginBottom: 6,
      boxShadow: (d.on || d.event) ? `0 4px 14px ${(d.event ? D.orange : D.blue)}1c` : 'none',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: d.event ? D.orangeSoft : (d.on ? D.blueSoft : D.card),
        border: d.on || d.event ? 'none' : `1px solid ${D.hair}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
          color: d.event ? D.orangeInk : (d.on ? D.blue : D.ink3),
        }}>{d.weekday}</div>
        <div style={{
          fontSize: 17, fontWeight: 700, lineHeight: 1, marginTop: 1,
          color: d.event ? D.orangeInk : (d.on ? D.blue : D.ink),
          fontVariantNumeric: 'tabular-nums',
        }}>{d.date}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: D.ink }}>
          {d.label ? `${d.label} · May ${d.date}` : `May ${d.date}`}
        </div>
        <div style={{ fontSize: 12, color: D.ink3, marginTop: 2 }}>
          {d.event ? 'Day of the meeting' :
           d.on ? 'Will be notified' : 'No notifications'}
        </div>
      </div>
      {/* Toggle / locked event marker */}
      {d.event ? (
        <div style={{
          padding: '4px 10px', borderRadius: 999,
          background: D.orangeSoft, color: D.orangeInk,
          fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>Always</div>
      ) : (
        <div style={{
          width: 44, height: 26, borderRadius: 13,
          background: d.on ? D.blue : D.mute,
          position: 'relative', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 2, left: d.on ? 20 : 2,
            width: 22, height: 22, borderRadius: 11, background: '#fff',
            boxShadow: `0 1px 3px ${D.shadowAmt2}`,
            transition: 'left .2s',
          }} />
        </div>
      )}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <CRHeader step={3} title="Custom · pick days" sub="Choose the days you want to be notified before the event." />

      {/* Counter */}
      <div style={{ padding: '0 24px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Days
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 999,
          background: D.blueSoft, color: D.blue,
          fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
        }}>{selectedCount} selected</div>
      </div>

      <div style={{ padding: '0 16px', overflow: 'hidden' }}>
        {days.map((d, i) => <Row key={i} d={d} />)}
      </div>

      <div style={{ flex: 1 }} />

      {/* Helper chip */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{
          padding: '12px 14px', borderRadius: 14,
          background: D.blueSoft, color: D.blueDark,
          fontSize: 13, lineHeight: 1.4, display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: D.blue, flexShrink: 0 }} />
          <div>Next you'll set times for each selected day.</div>
        </div>
      </div>

      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 3c. Custom · Per-day times ───────────────────────────────
// Step 2 of the custom flow: for each selected day, set up to 3 times.
function CR3c_CustomTimes() {
  // One block per selected day. Each block has its own times array (max 3).
  const days = [
    {
      weekday: 'Tue', date: 26, sub: '3 days before',
      times: [{ t: '9:00 AM' }],
    },
    {
      weekday: 'Thu', date: 28, sub: '1 day before',
      times: [{ t: '8:00 AM' }, { t: '6:00 PM' }],
    },
    {
      weekday: 'Fri', date: 29, sub: 'Day of the meeting', event: true,
      times: [{ t: '8:00 AM' }, { t: '12:00 PM' }, { t: '1:30 PM' }],
    },
  ];
  const PER_DAY = 3;
  const total = days.reduce((s, d) => s + d.times.length, 0);
  const maxTotal = days.length * PER_DAY;

  const TimePill = ({ t }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 10px 8px 12px', borderRadius: 999,
      background: D.bg, border: `1px solid ${D.hair}`,
    }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <circle cx="5.5" cy="5.5" r="4.5" stroke={D.ink3} strokeWidth="1.3" />
        <path d="M5.5 3v2.7l1.6 1.1" stroke={D.ink3} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <div style={{ fontSize: 13, color: D.ink, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{t}</div>
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: D.track,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: 2, color: D.ink3, fontSize: 12, lineHeight: 1, fontWeight: 400,
      }}>×</div>
    </div>
  );

  const AddPill = ({ disabled }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 12px', borderRadius: 999,
      border: `1.5px dashed ${disabled ? D.mute : D.blue}`,
      color: disabled ? D.ink3 : D.blue,
      fontSize: 13, fontWeight: 600,
      opacity: disabled ? 0.7 : 1,
    }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
      Add time
    </div>
  );

  const DayCard = ({ d }) => {
    const atCap = d.times.length >= PER_DAY;
    return (
      <div style={{
        background: D.card, borderRadius: 18,
        border: `1px solid ${D.hair}`,
        padding: '14px 16px', marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: d.event ? D.orangeSoft : D.blueSoft,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
              color: d.event ? D.orangeInk : D.blue,
            }}>{d.weekday}</div>
            <div style={{
              fontSize: 16, fontWeight: 700, lineHeight: 1, marginTop: 1,
              color: d.event ? D.orangeInk : D.blue,
              fontVariantNumeric: 'tabular-nums',
            }}>{d.date}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: D.ink }}>May {d.date}</div>
            <div style={{ fontSize: 12, color: D.ink3, marginTop: 2 }}>{d.sub}</div>
          </div>
          <div style={{
            padding: '4px 9px', borderRadius: 999,
            background: atCap ? D.orangeSoft : D.bg,
            color: atCap ? D.orangeInk : D.ink2,
            fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
            border: atCap ? 'none' : `1px solid ${D.hair}`,
          }}>{d.times.length}/{PER_DAY}</div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {d.times.map((tm, i) => <TimePill key={i} t={tm.t} />)}
          <AddPill disabled={atCap} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <CRHeader step={3} title="Set times for each day" sub="Up to 3 notifications per day." />

      {/* Total notifications counter */}
      <div style={{ padding: '0 24px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Total notifications
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 999,
          background: D.blueSoft, color: D.blue,
          fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
        }}>{total} / {maxTotal}</div>
      </div>

      <div style={{ padding: '0 16px', overflow: 'hidden' }}>
        {days.map((d, i) => <DayCard key={i} d={d} />)}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Save schedule</PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, {
  CR1_Title, CR2_When, CR3_Schedule, CR3b_Custom, CR3c_CustomTimes, CR4_Message, CR5_Review, CR6_Created,
});
