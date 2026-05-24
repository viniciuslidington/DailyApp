// All Daily app screens — composed inside IOSDevice frames on the canvas.
// Color tokens centralized; each screen is a self-contained component.

// Theme tokens. Both palettes carry the same keys; `applyTheme` swaps D's
// fields in place when the user toggles dark mode in Tweaks. Components read
// `D.blue` etc. fresh each render so a single re-render of <App/> propagates
// the change everywhere without prop-drilling.
const LIGHT = {
  blue: '#2F6BFF',
  blueDark: '#1E54D9',
  blueSoft: '#EAF1FF',
  orange: '#FF7A3D',
  orangeSoft: '#FFEEE3',
  orangeInk: '#7A3A14',
  ink: '#15171C',
  ink2: '#5B6271',
  ink3: '#9AA0AE',
  hair: 'rgba(60,60,67,0.10)',
  bg: '#F6F7F9',
  card: '#FFFFFF',
  // Extended tokens (refactored out of color literals)
  track: '#E6E9EF', // progress bar bg, timeline rail, divider lines
  mute: '#D8DCE5', // toggle off, inactive progress dot
  purple: '#7C5CFF',
  purpleSoft: '#F2EBFF',
  purpleInk: '#5B3DBF',
  success: '#1FB364',
  // Habit preset tints (RT1_Pick)
  tintBlue: '#E6F4FF',
  tintGreen: '#E8F8EE',
  tintAmber: '#FFF1E0',
  tintPink: '#FFEBEE',
  tintGray: '#F2F3F6',
  // Notification glass surface (notification preview)
  glass: 'rgba(255,255,255,0.92)',
  glassSoft: 'rgba(255,255,255,0.7)',
  glassBorder: 'rgba(0,0,0,0.04)',
  // Shadow alphas
  shadowAmt: 'rgba(0,0,0,0.06)',
  shadowAmt2: 'rgba(0,0,0,0.12)',
  // The drink-water glass fill on Home routine card
  glassFill: '#F1F5FB',
  orangeEnd: '#E2541A'
};
const DARK = {
  blue: '#4D85FF',
  blueDark: '#2F6BFF',
  blueSoft: 'rgba(77,133,255,0.18)',
  orange: '#FF8A4D',
  orangeSoft: 'rgba(255,138,77,0.16)',
  orangeInk: '#FFB58A',
  ink: '#F0F2F7',
  ink2: '#9AA3B5',
  ink3: '#646B7C',
  hair: 'rgba(255,255,255,0.08)',
  bg: '#0B0E14',
  card: '#171B23',
  track: '#23272F',
  mute: '#2D323D',
  purple: '#9B82FF',
  purpleSoft: 'rgba(155,130,255,0.18)',
  purpleInk: '#C5B5FF',
  success: '#22C56A',
  tintBlue: 'rgba(77,133,255,0.14)',
  tintGreen: 'rgba(34,197,106,0.14)',
  tintAmber: 'rgba(255,170,77,0.14)',
  tintPink: 'rgba(255,107,138,0.14)',
  tintGray: '#23272F',
  glass: 'rgba(36,40,50,0.94)',
  glassSoft: 'rgba(36,40,50,0.55)',
  glassBorder: 'rgba(255,255,255,0.06)',
  shadowAmt: 'rgba(0,0,0,0.45)',
  shadowAmt2: 'rgba(0,0,0,0.6)',
  glassFill: '#1E2330',
  orangeEnd: '#D9591F'
};
const D = { ...LIGHT };
function applyTheme(dark) {
  // Wipe + assign so removed keys (none currently) wouldn't linger.
  Object.keys(D).forEach((k) => delete D[k]);
  Object.assign(D, dark ? DARK : LIGHT);
}
window.applyTheme = applyTheme;
window.D = D;

// ─── Reusable bits ────────────────────────────────────────────
function PrimaryButton({ children, color = D.blue, style = {} }) {
  return (
    <div style={{
      height: 54, borderRadius: 16, background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 17, fontWeight: 600, letterSpacing: -0.2,
      boxShadow: `0 6px 18px ${color}33`,
      ...style
    }}>{children}</div>);

}

function GhostButton({ children, style = {} }) {
  return (
    <div style={{
      height: 54, borderRadius: 16, color: D.ink2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, fontWeight: 500, ...style
    }}>{children}</div>);

}

function Logo({ size = 84 }) {
  // Concentric ring mark — blue ring + small orange dot at 2 o'clock.
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: D.card,
      boxShadow: `0 12px 36px ${D.blue}38, inset 0 0 0 1px ${D.hair}`,
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: size * 0.56, height: size * 0.56, borderRadius: '50%',
        border: `${size * 0.08}px solid ${D.blue}`
      }} />
      <div style={{
        position: 'absolute', top: size * 0.18, right: size * 0.2,
        width: size * 0.16, height: size * 0.16, borderRadius: '50%',
        background: D.orange,
        boxShadow: `0 2px 6px ${D.orange}66`
      }} />
    </div>);

}

function ProgressDots({ idx, total = 4 }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) =>
      <div key={i} style={{
        width: i === idx ? 22 : 6, height: 6, borderRadius: 3,
        background: i === idx ? D.blue : D.mute,
        transition: 'width .25s'
      }} />
      )}
    </div>);

}

// ─── 1. Welcome ───────────────────────────────────────────────
function S1_Welcome() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.card,
      padding: '120px 28px 36px',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <Logo size={96} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: D.ink, letterSpacing: -1.2 }}>Daily</div>
          <div style={{ fontSize: 17, color: D.ink2, marginTop: 10, lineHeight: 1.4, maxWidth: 280 }}>
            One small thing,<br />every day.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <PrimaryButton>Get started</PrimaryButton>
        <GhostButton>I already have an account</GhostButton>
      </div>
    </div>);

}

// ─── 2. Create account ────────────────────────────────────────
function S2_SignUp() {
  const Field = ({ label, value, focused, type = 'text' }) =>
  <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: D.ink2, marginBottom: 6, paddingLeft: 4 }}>{label}</div>
      <div style={{
      height: 52, borderRadius: 14, background: D.card,
      border: `1.5px solid ${focused ? D.blue : D.hair}`,
      padding: '0 16px', display: 'flex', alignItems: 'center',
      fontSize: 17, color: D.ink, position: 'relative'
    }}>
        {type === 'password' ? '••••••••••' : value}
        {focused &&
      <div style={{
        width: 2, height: 22, background: D.blue, marginLeft: 1,
        animation: 'blink 1s infinite'
      }} />
      }
      </div>
    </div>;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.bg,
      padding: '70px 24px 0', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ marginBottom: 24 }}>
        <ProgressDots idx={0} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: D.ink, letterSpacing: -0.8, marginBottom: 6 }}>Create your account</div>
      <div style={{ fontSize: 15, color: D.ink2, marginBottom: 28 }}>So your reminders follow you everywhere.</div>

      <Field label="Email" value="alex@hey.com" />
      <Field label="Password" type="password" focused />

      <div style={{ flex: 1 }} />
      <div style={{ paddingBottom: 14 }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>);

}

// ─── 3. Name ──────────────────────────────────────────────────
function S3_Name() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.bg,
      padding: '70px 24px 0', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ marginBottom: 24 }}>
        <ProgressDots idx={1} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: D.ink, letterSpacing: -0.8, marginBottom: 6 }}>What should we call you?</div>
      <div style={{ fontSize: 15, color: D.ink2, marginBottom: 28 }}>We'll use this on your morning greeting.</div>

      <div style={{
        height: 64, borderRadius: 16, background: D.card,
        border: `1.5px solid ${D.blue}`,
        padding: '0 20px', display: 'flex', alignItems: 'center',
        fontSize: 22, fontWeight: 500, color: D.ink
      }}>
        Alex
        <div style={{ width: 2, height: 26, background: D.blue, marginLeft: 2, animation: 'blink 1s infinite' }} />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ paddingBottom: 14 }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>);

}

// ─── 4. Reminder time ─────────────────────────────────────────
function S4_Time() {
  // Mini wheel — three rows visible, middle one selected.
  const Wheel = ({ values, selectedIdx }) =>
  <div style={{
    flex: 1, height: 168, position: 'relative', overflow: 'hidden',
    fontVariantNumeric: 'tabular-nums'
  }}>
      <div style={{
      position: 'absolute', top: '50%', left: 0, right: 0,
      transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
        {[-2, -1, 0, 1, 2].map((off) => {
        const v = values[(selectedIdx + off + values.length) % values.length];
        const sel = off === 0;
        return (
          <div key={off} style={{
            height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: sel ? 30 : 24, fontWeight: sel ? 600 : 400,
            color: sel ? D.ink : D.ink3,
            opacity: Math.abs(off) === 2 ? 0.35 : 1
          }}>{v}</div>);

      })}
      </div>
    </div>;

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const mins = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.bg,
      padding: '70px 24px 0', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ marginBottom: 24 }}>
        <ProgressDots idx={2} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: D.ink, letterSpacing: -0.8, marginBottom: 6 }}>When should we remind you?</div>
      <div style={{ fontSize: 15, color: D.ink2, marginBottom: 28 }}>Pick a time that fits your routine.</div>

      <div style={{
        background: D.card, borderRadius: 20, padding: 12, position: 'relative',
        border: `1px solid ${D.hair}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Wheel values={hours} selectedIdx={7} />
          <div style={{ fontSize: 30, fontWeight: 600, color: D.ink, padding: '0 4px', marginTop: -2 }}>:</div>
          <Wheel values={mins} selectedIdx={30} />
          <div style={{ width: 70 }}>
            <Wheel values={['AM', 'PM']} selectedIdx={0} />
          </div>
        </div>
        {/* selection band */}
        <div style={{
          position: 'absolute', left: 8, right: 8, top: '50%',
          transform: 'translateY(-50%)', height: 48,
          background: D.blueSoft, borderRadius: 12, pointerEvents: 'none', zIndex: 0
        }} />
      </div>

      <div style={{
        marginTop: 18, padding: '14px 16px', borderRadius: 14,
        background: D.orangeSoft, color: D.orangeInk,
        fontSize: 14, lineHeight: 1.4, display: 'flex', gap: 10, alignItems: 'flex-start'
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 11, background: D.orange, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, flexShrink: 0
        }}>☀</div>
        <div>Mornings work best for most people — you can change this anytime.</div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ paddingBottom: 14 }}>
        <PrimaryButton>Continue</PrimaryButton>
      </div>
    </div>);

}

// ─── 5. Notifications permission ──────────────────────────────
function S5_Notifications() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.bg,
      padding: '70px 24px 0', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ marginBottom: 24 }}>
        <ProgressDots idx={3} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: D.ink, letterSpacing: -0.8, marginBottom: 6 }}>Turn on reminders</div>
      <div style={{ fontSize: 15, color: D.ink2, marginBottom: 28 }}>Daily lives in your notifications, not your screen time.</div>

      {/* faux notification preview */}
      <div style={{ position: 'relative', height: 220, marginTop: 8 }}>
        <div style={{
          position: 'absolute', top: 60, left: 6, right: 6,
          background: D.glassSoft, borderRadius: 22, padding: 14,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 6px 24px ${D.shadowAmt}, 0 0 0 1px ${D.glassBorder}`,
          transform: 'scale(0.92)', opacity: 0.6
        }}>
          <div style={{ height: 12, width: 80, background: D.mute, borderRadius: 6, marginBottom: 8 }} />
          <div style={{ height: 10, width: '70%', background: D.track, borderRadius: 5 }} />
        </div>
        <div style={{
          position: 'absolute', top: 30, left: 0, right: 0,
          background: D.glass, borderRadius: 22, padding: '14px 16px',
          boxShadow: `0 14px 40px ${D.shadowAmt2}, 0 0 0 1px ${D.glassBorder}`,
          display: 'flex', gap: 12, alignItems: 'flex-start'
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: D.card,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `inset 0 0 0 1px ${D.hair}`, flexShrink: 0
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, border: `3px solid ${D.blue}` }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: D.ink }}>Daily</div>
              <div style={{ fontSize: 13, color: D.ink3 }}>now</div>
            </div>
            <div style={{ fontSize: 14, color: D.ink, lineHeight: 1.35 }}>
              Good morning, Alex 👋 — drink a glass of water before coffee.
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 14 }}>
        <PrimaryButton color={D.orange}>Allow notifications</PrimaryButton>
        <GhostButton>Not now</GhostButton>
      </div>
    </div>);

}

// ─── 6. All set ───────────────────────────────────────────────
function S6_Done() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.card,
      padding: '70px 28px 36px', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        {/* checkmark badge */}
        <div style={{
          width: 110, height: 110, borderRadius: 55, background: D.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 16px 40px ${D.blue}44`, position: 'relative'
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M12 24l8 8 16-18" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{
            position: 'absolute', top: -6, right: -6,
            width: 26, height: 26, borderRadius: 13, background: D.orange,
            boxShadow: `0 4px 12px ${D.orange}66`
          }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: D.ink, letterSpacing: -0.8 }}>You're all set</div>
          <div style={{ fontSize: 16, color: D.ink2, marginTop: 10, lineHeight: 1.4, maxWidth: 280 }}>
            <br />
          </div>
        </div>
      </div>
      <PrimaryButton>Open Daily</PrimaryButton>
    </div>);

}

// ─── 7. Home ──────────────────────────────────────────────────
function Home() {
  const Item = ({ title, time, done, color = D.blue }) =>
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '16px 18px', background: D.card, borderRadius: 18,
    border: `1px solid ${D.hair}`
  }}>
      <div style={{
      width: 26, height: 26, borderRadius: 13,
      background: done ? color : 'transparent',
      border: done ? 'none' : `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
        {done &&
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
      }
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
        fontSize: 16, fontWeight: 500, color: done ? D.ink3 : D.ink,
        textDecoration: done ? 'line-through' : 'none'
      }}>{title}</div>
        <div style={{ fontSize: 13, color: D.ink3, marginTop: 2 }}>{time}</div>
      </div>
    </div>;


  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.bg,
      paddingTop: 60, display: 'flex', flexDirection: 'column'
    }}>
      {/* Greeting header */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div style={{ fontSize: 14, color: D.ink2, fontWeight: 500 }}>Thursday, May 22</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: D.ink, letterSpacing: -0.8 }}>Morning, Alex</div>
        </div>
      </div>

      {/* Streak chip */}
      <div style={{ padding: '6px 24px 18px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: D.orangeSoft, color: D.orangeInk,
          padding: '8px 14px 8px 10px', borderRadius: 999,
          fontSize: 14, fontWeight: 600
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11, background: D.orange, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700
          }}>7</div>
          day streak
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ fontSize: 13, color: D.ink2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, padding: '4px 6px 8px' }}>Today</div>
        <Item title="Drink a glass of water" time="8:30 AM" done />
        <Item title="Stretch for two minutes" time="12:00 PM" />
        <Item title="Write one line in your journal" time="9:30 PM" color={D.orange} />
      </div>

      {/* FAB */}
      <div style={{
        position: 'absolute', right: 22, bottom: 110,
        width: 60, height: 60, borderRadius: 30, background: D.blue,
        boxShadow: `0 10px 26px ${D.blue}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 30, fontWeight: 300, lineHeight: 1
      }}>+</div>

      {/* Tab bar */}
      <TabBar active="today" />
    </div>);

}

// ─── Login ────────────────────────────────────────────────────
function Login() {
  const Field = ({ label, value, focused, type = 'text', trailing }) =>
  <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: D.ink2, marginBottom: 6, paddingLeft: 4 }}>{label}</div>
      <div style={{
      height: 52, borderRadius: 14, background: D.card,
      border: `1.5px solid ${focused ? D.blue : D.hair}`,
      padding: '0 16px', display: 'flex', alignItems: 'center',
      fontSize: 17, color: D.ink, position: 'relative'
    }}>
        <div style={{ flex: 1 }}>{type === 'password' ? '••••••••••' : value}</div>
        {focused &&
      <div style={{ width: 2, height: 22, background: D.blue, marginLeft: 1, animation: 'blink 1s infinite' }} />
      }
        {trailing &&
      <div style={{ marginLeft: 12, color: D.ink3, display: 'flex', alignItems: 'center' }}>{trailing}</div>
      }
      </div>
    </div>;


  const SocialButton = ({ icon, label, dark }) =>
  <div style={{
    height: 52, borderRadius: 14,
    background: dark ? D.ink : D.card,
    color: dark ? '#fff' : D.ink,
    border: dark ? 'none' : `1px solid ${D.hair}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontSize: 15, fontWeight: 600
  }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
      {label}
    </div>;


  return (
    <div style={{
      position: 'absolute', inset: 0, background: D.bg,
      paddingTop: 64, display: 'flex', flexDirection: 'column'
    }}>
      {/* Back chevron */}
      <div style={{ padding: '0 24px', marginBottom: 28 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: D.card,
          border: `1px solid ${D.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke={D.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Logo + greeting */}
      <div style={{ padding: '0 24px', marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
        <Logo size={56} />
        <div>
          <div style={{ fontSize: 30, fontWeight: 700, color: D.ink, letterSpacing: -0.8 }}>Welcome back</div>
          <div style={{ fontSize: 15, color: D.ink2, marginTop: 6 }}>Sign in to pick up where you left off.</div>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <Field label="Email" value="alex@hey.com" />
        <Field
          label="Password"
          type="password"
          focused
          trailing={
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path d="M1 7s3-6 9-6 9 6 9 6-3 6-9 6S1 7 1 7z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          } />
        
        <div style={{ textAlign: 'right', marginTop: -4, paddingRight: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: D.blue }}>Forgot password?</span>
        </div>

        <div style={{ marginTop: 20 }}>
          <PrimaryButton>Sign in</PrimaryButton>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, background: D.hair }} />
          <div style={{ fontSize: 12, color: D.ink3, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>or</div>
          <div style={{ flex: 1, height: 1, background: D.hair }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SocialButton dark icon="" label="Continue with Apple" />
          <SocialButton icon="G" label="Continue with Google" />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{
        padding: '0 24px 28px', textAlign: 'center',
        fontSize: 14, color: D.ink2
      }}>
        Don't have an account?{' '}
        <span style={{ color: D.blue, fontWeight: 600 }}>Sign up</span>
      </div>
    </div>);

}

// Export to window for the canvas script
Object.assign(window, {
  S1_Welcome, S2_SignUp, S3_Name, S4_Time, S5_Notifications, S6_Done, Home, Login
});