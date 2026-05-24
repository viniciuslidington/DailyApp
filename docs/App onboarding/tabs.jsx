// All / Stats / You — three main tab screens.
// Reuses the D tokens declared in screens.jsx.

// ─── Tab icons ────────────────────────────────────────────────
// iOS-style swap: outlined when inactive, filled when active.
// All drawn in a 24×24 viewBox at currentColor so the parent controls hue.
function TabIcon({ kind, active }) {
  const sw = 1.8;
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none' };
  const strokeProps = { stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };

  if (kind === 'today') {
    // Day-of-month: rounded calendar with the current day filled in.
    return active ? (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" fill="currentColor" />
        <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="#fff" strokeWidth="1.4" />
        <line x1="8" y1="3.5" x2="8" y2="6.5" {...strokeProps} />
        <line x1="16" y1="3.5" x2="16" y2="6.5" {...strokeProps} />
        <circle cx="12" cy="15" r="2.4" fill="#fff" />
      </svg>
    ) : (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" {...strokeProps} />
        <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" {...strokeProps} />
        <line x1="8" y1="3.5" x2="8" y2="6.5" {...strokeProps} />
        <line x1="16" y1="3.5" x2="16" y2="6.5" {...strokeProps} />
        <circle cx="12" cy="15" r="1.7" fill="currentColor" />
      </svg>
    );
  }

  if (kind === 'all') {
    // Bullet list — three dots + three lines, identical in both states
    // (the colour change reads as the swap).
    const dotFill = active ? 'currentColor' : 'currentColor';
    return (
      <svg {...common}>
        <circle cx="5.5" cy="7" r="1.7" fill={dotFill} />
        <circle cx="5.5" cy="12" r="1.7" fill={dotFill} />
        <circle cx="5.5" cy="17" r="1.7" fill={dotFill} />
        <line x1="10" y1="7" x2="20" y2="7" {...strokeProps} strokeWidth={active ? 2.2 : sw} />
        <line x1="10" y1="12" x2="20" y2="12" {...strokeProps} strokeWidth={active ? 2.2 : sw} />
        <line x1="10" y1="17" x2="17" y2="17" {...strokeProps} strokeWidth={active ? 2.2 : sw} />
      </svg>
    );
  }

  if (kind === 'stats') {
    // Three bars of increasing height.
    const bar = (x, y, h) => active
      ? <rect x={x} y={y} width="3.6" height={h} rx="1.4" fill="currentColor" />
      : <rect x={x + 0.3} y={y + 0.3} width="3" height={h - 0.6} rx="1.2" {...strokeProps} />;
    return (
      <svg {...common}>
        {bar(3.6, 13, 7.5)}
        {bar(10.2, 9, 11.5)}
        {bar(16.8, 5, 15.5)}
      </svg>
    );
  }

  if (kind === 'you') {
    return active ? (
      <svg {...common}>
        <circle cx="12" cy="8.5" r="3.8" fill="currentColor" />
        <path d="M4 20.5 C4 16 7.5 13.5 12 13.5 C16.5 13.5 20 16 20 20.5 Z" fill="currentColor" />
      </svg>
    ) : (
      <svg {...common}>
        <circle cx="12" cy="8.5" r="3.5" {...strokeProps} />
        <path d="M4.8 20 C4.8 15.5 8 14 12 14 C16 14 19.2 15.5 19.2 20" {...strokeProps} />
      </svg>
    );
  }
  return null;
}

// ─── Shared tab bar ───────────────────────────────────────────
function TabBar({ active }) {
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'all',   label: 'All' },
    { id: 'stats', label: 'Stats' },
    { id: 'you',   label: 'You' },
  ];
  return (
    <div style={{
      margin: '14px 16px 36px', height: 64, borderRadius: 24,
      background: D.card, border: `1px solid ${D.hair}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      boxShadow: `0 2px 10px ${D.shadowAmt}`,
      paddingTop: 4,
    }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? D.blue : D.ink3,
            fontSize: 11, fontWeight: isActive ? 600 : 500,
            letterSpacing: 0.1,
          }}>
            <TabIcon kind={t.id} active={isActive} />
            <div>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { TabBar, TabIcon });

function PageHeader({ title, sub }) {
  return (
    <div style={{ padding: '20px 24px 16px' }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: D.ink, letterSpacing: -0.8 }}>{title}</div>
      {sub && <div style={{ fontSize: 14, color: D.ink2, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── All ──────────────────────────────────────────────────────
function AllPage() {
  const Pill = ({ active, children }) => (
    <div style={{
      padding: '8px 16px', borderRadius: 999,
      background: active ? D.ink : 'transparent',
      color: active ? '#fff' : D.ink2,
      fontSize: 14, fontWeight: 600,
    }}>{children}</div>
  );

  const Item = ({ title, time, color = D.blue, done, count }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px', background: D.card, borderRadius: 18,
      border: `1px solid ${D.hair}`,
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 500, color: done ? D.ink3 : D.ink,
          textDecoration: done ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</div>
        <div style={{ fontSize: 13, color: D.ink3, marginTop: 2 }}>{time}</div>
      </div>
      {count && (
        <div style={{
          padding: '4px 9px', borderRadius: 999,
          background: D.blueSoft, color: D.blue, fontSize: 12, fontWeight: 600,
        }}>{count}</div>
      )}
    </div>
  );

  const SectionLabel = ({ children, count }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '14px 6px 8px',
    }}>
      <div style={{ fontSize: 13, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{children}</div>
      <div style={{ fontSize: 12, color: D.ink3, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 60, display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="All reminders" />

      {/* Filter pills */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6 }}>
        <Pill active>Upcoming</Pill>
        <Pill>Routines</Pill>
        <Pill>Done</Pill>
      </div>

      <div style={{ padding: '0 20px 0', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <SectionLabel count="2">This week</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Item title="Important meeting" time="Fri, May 29 · 2:00 PM" count="3" />
          <Item title="Submit expense report" time="Sun, May 31" color={D.orange} />
        </div>

        <SectionLabel count="3">Daily</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Item title="Drink a glass of water" time="Every day · 8:30 AM" done />
          <Item title="Stretch for two minutes" time="Every day · 12:00 PM" />
          <Item title="Write one line in your journal" time="Every day · 9:30 PM" color={D.orange} />
        </div>
      </div>

      <TabBar active="all" />
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────
function StatsPage() {
  // Last 7 days bar chart (% completed)
  const days = [
    { d: 'Sa', v: 0.8 }, { d: 'Su', v: 1.0 }, { d: 'Mo', v: 0.6 },
    { d: 'Tu', v: 1.0 }, { d: 'We', v: 0.4 }, { d: 'Th', v: 1.0 },
    { d: 'Fr', v: 0.66, today: true },
  ];

  const StatCard = ({ label, value, sub, tint = D.blueSoft, color = D.blue }) => (
    <div style={{
      flex: 1, padding: '16px 16px 18px', borderRadius: 18,
      background: D.card, border: `1px solid ${D.hair}`,
    }}>
      <div style={{ fontSize: 12, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>{label}</div>
      <div style={{
        display: 'inline-block', padding: '4px 10px', borderRadius: 10,
        background: tint, color, fontSize: 22, fontWeight: 700,
        fontVariantNumeric: 'tabular-nums', letterSpacing: -0.4,
      }}>{value}</div>
      <div style={{ fontSize: 12, color: D.ink3, marginTop: 8 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 60, display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Your progress" sub="Last 7 days · keep it up." />

      {/* Streak hero */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${D.orange} 0%, ${D.orangeEnd} 100%)`,
          borderRadius: 22, padding: '20px 22px', color: '#fff',
          boxShadow: `0 12px 30px ${D.orange}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.85 }}>Current streak</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
              <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1 }}>7</div>
              <div style={{ fontSize: 16, fontWeight: 500, opacity: 0.9 }}>days</div>
            </div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>Best: 14 days</div>
          </div>
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 700,
          }}>☀</div>
        </div>
      </div>

      {/* Weekly chart */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: D.card, borderRadius: 20, padding: '18px 18px 14px',
          border: `1px solid ${D.hair}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div style={{ fontSize: 14, color: D.ink2, fontWeight: 600 }}>This week</div>
            <div style={{ fontSize: 14, color: D.ink, fontWeight: 600 }}>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 22, letterSpacing: -0.4 }}>78</span>
              <span style={{ color: D.ink3, fontWeight: 500 }}>%</span>
            </div>
          </div>
          <div style={{
            height: 110, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8,
          }}>
            {days.map((day) => (
              <div key={day.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: '100%', maxWidth: 28, height: Math.max(8, day.v * 90),
                  borderRadius: 6,
                  background: day.today ? D.orange : D.blue,
                  opacity: day.today ? 1 : (0.4 + day.v * 0.6),
                }} />
                <div style={{ fontSize: 12, color: day.today ? D.ink : D.ink3, fontWeight: day.today ? 600 : 500 }}>{day.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ padding: '0 20px', display: 'flex', gap: 10 }}>
        <StatCard label="Done" value="42" sub="reminders this month" />
        <StatCard label="On time" value="91%" sub="within 10 min" tint={D.orangeSoft} color={D.orangeInk} />
      </div>

      <div style={{ flex: 1 }} />
      <TabBar active="stats" />
    </div>
  );
}

// ─── You ──────────────────────────────────────────────────────
function YouPage() {
  const Row = ({ icon, tint, title, value, toggle, last }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${D.hair}`,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: tint, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 16, color: D.ink, fontWeight: 500 }}>{title}</div>
      {value && <div style={{ fontSize: 14, color: D.ink3, fontWeight: 500 }}>{value}</div>}
      {toggle !== undefined ? (
        <div style={{
          width: 44, height: 26, borderRadius: 13,
          background: toggle ? D.blue : D.mute,
          position: 'relative', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 2, left: toggle ? 20 : 2,
            width: 22, height: 22, borderRadius: 11, background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left .2s',
          }} />
        </div>
      ) : value ? null : (
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ flexShrink: 0 }}>
          <path d="M1 1l6 6-6 6" stroke={D.ink3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );

  const Group = ({ children }) => (
    <div style={{
      background: D.card, borderRadius: 18,
      border: `1px solid ${D.hair}`, overflow: 'hidden',
      marginBottom: 16,
    }}>{children}</div>
  );

  const GroupLabel = ({ children }) => (
    <div style={{ fontSize: 12, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, padding: '4px 6px 8px' }}>{children}</div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: D.bg, paddingTop: 60, display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="You" />

      {/* Profile card */}
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{
          background: D.card, borderRadius: 22, padding: '18px 20px',
          border: `1px solid ${D.hair}`,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* Avatar */}
          <div style={{
            width: 56, height: 56, borderRadius: 28,
            background: `linear-gradient(135deg, ${D.blue} 0%, ${D.blueDark} 100%)`,
            color: '#fff', fontSize: 22, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 16px ${D.blue}33`, flexShrink: 0,
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: D.ink, letterSpacing: -0.3 }}>Alex</div>
            <div style={{ fontSize: 13, color: D.ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>alex@hey.com</div>
          </div>
          <div style={{
            padding: '7px 12px', borderRadius: 999,
            background: D.blueSoft, color: D.blue,
            fontSize: 13, fontWeight: 600,
          }}>Edit</div>
        </div>
      </div>

      {/* Settings */}
      <div style={{ padding: '0 20px', flex: 1, overflow: 'hidden' }}>
        <GroupLabel>Reminders</GroupLabel>
        <Group>
          <Row icon="◷" tint={D.blue} title="Default time" value="8:30 AM" />
          <Row icon="♪" tint={D.purple} title="Sound" value="Chime" />
          <Row icon="◐" tint={D.orange} title="Quiet hours" toggle last />
        </Group>

        <GroupLabel>App</GroupLabel>
        <Group>
          <Row icon="◑" tint={D.ink} title="Appearance" value="Light" />
          <Row icon="✦" tint={D.success} title="Daily Pro" value="Upgrade" last />
        </Group>

        <GroupLabel>Account</GroupLabel>
        <Group>
          <Row icon="↗" tint={D.ink3} title="Sign out" last />
        </Group>
      </div>

      <TabBar active="you" />
    </div>
  );
}

Object.assign(window, { AllPage, StatsPage, YouPage });
