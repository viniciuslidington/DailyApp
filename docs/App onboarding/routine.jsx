// Daily routine flow — five screens.
// Lighter sibling of the create-reminder flow: preset-led, day-of-week
// picker, multi-time-per-day, optional goal. Reuses D tokens from screens.jsx.

// ─── Shared chrome ────────────────────────────────────────────
function RTHeader({ step, total = 4, title, sub, accent = D.blue }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', marginBottom: 22,
      }}>
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

      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <div style={{ height: 4, background: D.track, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(step / total) * 100}%`, height: '100%',
            background: accent, borderRadius: 2, transition: 'width .3s',
          }} />
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: 22 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: D.ink, letterSpacing: -0.7, marginBottom: 6 }}>{title}</div>
        {sub && <div style={{ fontSize: 15, color: D.ink2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── 1. Pick a routine ────────────────────────────────────────
function RT1_Pick() {
  const presets = [
    { icon: '💧', label: 'Drink water', tint: D.tintBlue, selected: true },
    { icon: '🧘', label: 'Stretch', tint: D.purpleSoft },
    { icon: '📖', label: 'Read', tint: D.tintAmber },
    { icon: '🚶', label: 'Walk', tint: D.tintGreen },
    { icon: '✦', label: 'Meditate', tint: D.tintPink },
    { icon: '+', label: 'Custom', tint: D.tintGray, custom: true },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <RTHeader step={1} title="Pick a routine" sub="Small habits that stack up over time." />

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {presets.map((p, i) => (
            <div key={i} style={{
              padding: '16px 14px', borderRadius: 18,
              background: D.card,
              border: `1.5px solid ${p.selected ? D.blue : D.hair}`,
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: p.selected ? `0 6px 18px ${D.blue}1f` : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: p.tint,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: p.custom ? D.ink3 : 'inherit',
                fontWeight: p.custom ? 300 : 400, flexShrink: 0,
              }}>{p.icon}</div>
              <div style={{
                fontSize: 14, fontWeight: 600,
                color: p.selected ? D.blue : (p.custom ? D.ink2 : D.ink),
              }}>{p.label}</div>
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

// ─── 2. Days of week ──────────────────────────────────────────
function RT2_Days() {
  // Selected: Mon-Fri (weekdays)
  const days = [
    { l: 'M', on: true }, { l: 'T', on: true }, { l: 'W', on: true },
    { l: 'T', on: true }, { l: 'F', on: true }, { l: 'S', on: false },
    { l: 'S', on: false },
  ];
  const Preset = ({ active, children }) => (
    <div style={{
      padding: '9px 16px', borderRadius: 999,
      background: active ? D.ink : D.card,
      color: active ? '#fff' : D.ink2,
      border: active ? 'none' : `1px solid ${D.hair}`,
      fontSize: 14, fontWeight: 600,
    }}>{children}</div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <RTHeader step={2} title="Which days?" sub="Pick the days you want this to repeat." />

      <div style={{ padding: '0 20px' }}>
        {/* Day chips */}
        <div style={{
          background: D.card, borderRadius: 22, padding: '20px 16px',
          border: `1px solid ${D.hair}`,
          display: 'flex', justifyContent: 'space-between', gap: 6,
        }}>
          {days.map((d, i) => (
            <div key={i} style={{
              width: 40, height: 40, borderRadius: 20,
              background: d.on ? D.blue : 'transparent',
              border: d.on ? 'none' : `1.5px solid ${D.hair}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 600,
              color: d.on ? '#fff' : D.ink2,
              boxShadow: d.on ? `0 4px 10px ${D.blue}33` : 'none',
            }}>{d.l}</div>
          ))}
        </div>

        {/* Presets */}
        <div style={{ fontSize: 12, color: D.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 4px 10px' }}>
          Quick presets
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Preset>Every day</Preset>
          <Preset active>Weekdays</Preset>
          <Preset>Weekends</Preset>
          <Preset>Mon · Wed · Fri</Preset>
        </div>

        {/* Summary */}
        <div style={{
          marginTop: 22, padding: '14px 16px', borderRadius: 14,
          background: D.blueSoft, color: D.blueDark,
          fontSize: 14, lineHeight: 1.4, display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: D.blue, flexShrink: 0 }} />
          <div><b>5 days a week</b> · about 260 reminders a year</div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 3. Times of day ──────────────────────────────────────────
function RT3_Times() {
  const times = [
    { label: 'Morning', value: '8:30 AM', tint: D.orangeSoft, color: D.orangeInk },
    { label: 'Afternoon', value: '1:00 PM', tint: D.blueSoft, color: D.blue },
    { label: 'Evening', value: '7:00 PM', tint: D.purpleSoft, color: D.purpleInk },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <RTHeader step={3} title="What time?" sub="Add as many pings as you need across the day." />

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {times.map((t, i) => (
            <div key={i} style={{
              background: D.card, borderRadius: 16,
              border: `1px solid ${D.hair}`,
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: t.tint, color: t.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, flexShrink: 0,
              }}>{t.label.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: D.ink2, fontWeight: 500 }}>{t.label}</div>
                <div style={{ fontSize: 17, color: D.ink, fontWeight: 600, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{t.value}</div>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: 15,
                background: D.bg, color: D.ink3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 400, flexShrink: 0,
              }}>×</div>
            </div>
          ))}

          {/* Add another */}
          <div style={{
            borderRadius: 16, padding: '14px 16px',
            border: `1.5px dashed ${D.blue}`,
            display: 'flex', alignItems: 'center', gap: 12,
            color: D.blue, fontSize: 15, fontWeight: 600,
            background: 'transparent',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: D.blueSoft, color: D.blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 400, lineHeight: 1,
            }}>+</div>
            Add another time
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 4. Goal (optional but encouraged) ────────────────────────
function RT4_Goal() {
  const target = 8;
  // 8 little glass dots, filled to indicate target
  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      <RTHeader step={4} title="Set a daily goal" sub="Optional — but counting feels good." />

      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: D.card, borderRadius: 22, padding: '24px 20px',
          border: `1px solid ${D.hair}`,
        }}>
          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 22, background: D.bg,
              border: `1px solid ${D.hair}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: D.ink2, fontWeight: 400, lineHeight: 1,
            }}>−</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 52, fontWeight: 700, color: D.ink,
                letterSpacing: -1.5, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>{target}</div>
              <div style={{ fontSize: 13, color: D.ink2, marginTop: 4, fontWeight: 500 }}>glasses per day</div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: D.blue, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 400, lineHeight: 1,
              boxShadow: `0 4px 12px ${D.blue}55`,
            }}>+</div>
          </div>

          {/* Glass dots row */}
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 8 }}>
            {Array.from({ length: target }).map((_, i) => (
              <div key={i} style={{
                width: 22, height: 28, borderRadius: '4px 4px 8px 8px',
                background: D.blueSoft,
                border: `2px solid ${D.blue}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '60%', background: D.blue,
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Toggle: skip goal */}
        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 16,
          background: D.card, border: `1px solid ${D.hair}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: D.ink, fontWeight: 500 }}>Just remind me</div>
            <div style={{ fontSize: 12, color: D.ink2, marginTop: 2 }}>No counting, no goal.</div>
          </div>
          <div style={{
            width: 44, height: 26, borderRadius: 13,
            background: D.mute, position: 'relative', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 2, left: 2,
              width: 22, height: 22, borderRadius: 11, background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 14px' }}>
        <PrimaryButton>Create routine</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 5. Done — habit card on home ─────────────────────────────
function RT5_Done() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 60, display: 'flex', flexDirection: 'column' }}>
      {/* Toast */}
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
          <div style={{ fontSize: 14, fontWeight: 600, color: D.ink }}>Routine added</div>
          <div style={{ fontSize: 12, color: D.ink2 }}>First ping Monday at 8:30 AM.</div>
        </div>
        <div style={{ fontSize: 13, color: D.blue, fontWeight: 600 }}>View</div>
      </div>

      <div style={{ padding: '70px 24px 12px' }}>
        <div style={{ fontSize: 14, color: D.ink2, fontWeight: 500 }}>Saturday, May 23</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: D.ink, letterSpacing: -0.8, marginTop: 4 }}>Morning, Alex</div>
      </div>

      <div style={{ padding: '6px 20px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ fontSize: 13, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, padding: '4px 6px 0' }}>
          Daily routines
        </div>

        {/* Drink water card — featured */}
        <div style={{
          background: D.card, borderRadius: 20,
          border: `2px solid ${D.blue}`, padding: '16px 18px',
          boxShadow: `0 10px 28px ${D.blue}22`, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -10, right: 14,
            padding: '3px 8px', borderRadius: 999,
            background: D.blue, color: '#fff',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
          }}>New</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: D.tintBlue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>💧</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: D.ink }}>Drink water</div>
              <div style={{ fontSize: 13, color: D.ink2, marginTop: 1 }}>Weekdays · 3 times a day</div>
            </div>
            <div style={{
              fontSize: 14, fontWeight: 600, color: D.blue,
              fontVariantNumeric: 'tabular-nums',
            }}>0 / 8</div>
          </div>
          {/* Glass dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 26, borderRadius: '3px 3px 6px 6px',
                background: D.glassFill, border: `1.5px solid ${D.blue}`,
                opacity: 0.6,
              }} />
            ))}
          </div>
        </div>

        <div style={{ fontSize: 13, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, padding: '14px 6px 0' }}>
          Today's todos
        </div>
        <div style={{
          background: D.card, borderRadius: 18, border: `1px solid ${D.hair}`,
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 12, background: D.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M3 7l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: D.ink3, textDecoration: 'line-through' }}>Stretch for two minutes</div>
            <div style={{ fontSize: 12, color: D.ink3, marginTop: 2 }}>12:00 PM</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <TabBar active="today" />
    </div>
  );
}

Object.assign(window, { RT1_Pick, RT2_Days, RT3_Times, RT4_Goal, RT5_Done });
