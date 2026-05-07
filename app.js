const SUPABASE_URL = 'https://yygjkqkzbdjnyyrrhdku.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Z2prcWt6YmRqbnl5cnJoZGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjgyNTcsImV4cCI6MjA5MzYwNDI1N30.6mJTBhjWphURBnFefQziVreQW8WjYJLAAjMx6Sv-Kfk';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { useState, useEffect } = React;

function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Check for admin in URL
   const params = new URLSearchParams(window.location.search);
if (params.get('page') === 'admin') setPage('admin');

    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setPage('landing');
      }
    });
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
      if (data.status === 'approved') setPage('dashboard');
      else setPage('pending');
    }
  }

  if (page === 'landing') return <Landing setPage={setPage} />;
  if (page === 'signup') return <Signup setPage={setPage} />;
  if (page === 'login') return <Login setPage={setPage} fetchProfile={fetchProfile} />;
  if (page === 'pending') return <Pending />;
  if (page === 'dashboard') return <Dashboard user={user} profile={profile} setPage={setPage} />;
  if (page === 'study') return <Study profile={profile} setPage={setPage} />;
  if (page === 'leaderboard') return <Leaderboard setPage={setPage} />;
  if (page === 'admin') return <Admin setPage={setPage} />;
  return <Landing setPage={setPage} />;
}

const S = {
  bg: '#0F0E0A', gold: '#C8A96E', teal: '#7EB8A4', purple: '#A89BC8',
  text: '#E8E0D0', muted: '#8A7F6E', dim: '#4A4035', border: '#2A2519',
  card: '#141309', font: "'Georgia', serif", mono: "'Courier New', monospace",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0F0E0A; color: #E8E0D0; font-family: Georgia, serif; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #C8A96E; }
  input, textarea, select { outline: none; }
  a { text-decoration: none; }
  .fade { animation: fadeUp 0.5s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .btn { display:inline-block; padding:12px 28px; font-family:'DM Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border:none; border-radius:2px; transition:all 0.2s; }
  .btn:hover { opacity:0.85; transform:translateY(-1px); }
  .btn-gold { background:#C8A96E; color:#0F0E0A; }
  .btn-outline { background:transparent; color:#E8E0D0; border:1px solid #2A2519; }
  .btn-outline:hover { border-color:#C8A96E44; }
  .card { background:#141309; border:1px solid #2A2519; border-radius:4px; padding:32px; }
  .input { width:100%; background:#0F0E0A; border:1px solid #2A2519; border-radius:2px; padding:12px 16px; color:#E8E0D0; font-family:Georgia,serif; font-size:14px; transition:border-color 0.2s; }
  .input:focus { border-color:#C8A96E44; }
  .input::placeholder { color:#4A4035; }
  .label { display:block; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8A7F6E; margin-bottom:8px; }
  .chapter { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#C8A96E; display:block; margin-bottom:12px; }
  .ruled { border:none; border-top:1px solid #2A2519; margin:24px 0; }
  .quote { border-left:3px solid #C8A96E; padding:12px 24px; font-style:italic; color:#8A7F6E; font-family:'Playfair Display',serif; font-size:16px; }
  .page-lines { position:fixed; inset:0; pointer-events:none; z-index:0; opacity:0.015; background-image:repeating-linear-gradient(0deg,transparent,transparent 27px,#C8A96E 27px,#C8A96E 28px); }
  .nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:18px 48px; display:flex; align-items:center; justify-content:space-between; transition:all 0.3s; }
  .nav.scrolled { background:rgba(15,14,10,0.97); border-bottom:1px solid #2A2519; backdrop-filter:blur(8px); }
  .plan-card { background:#141309; border:1px solid #2A2519; border-radius:4px; padding:36px 28px; transition:transform 0.3s; position:relative; }
  .plan-card:hover { transform:translateY(-6px); }
  .check-item { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; font-size:13px; color:#8A7F6E; line-height:1.5; }
  .popular-tag { position:absolute; top:-1px; left:50%; transform:translateX(-50%); background:#7EB8A4; color:#0F0E0A; font-family:'DM Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; padding:4px 12px; border-radius:0 0 4px 4px; white-space:nowrap; }
  .reason-card { padding:24px; border:1px solid #1E1B14; border-radius:4px; background:#131209; transition:all 0.3s; }
  .reason-card:hover { border-color:#C8A96E44; }
  .timer-circle { transition: stroke-dashoffset 1s linear; }
  .leaderboard-row { display:flex; align-items:center; gap:16px; padding:16px 20px; border-bottom:1px solid #1E1B14; transition:background 0.2s; }
  .leaderboard-row:hover { background:#131209; }
`;

function Landing({ setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [payLinks, setPayLinks] = useState({ monthly: '#', sixmonth: '#', yearly: '#' });

  useEffect(() => {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 60));
    loadAdminSettings();
  }, []);

  async function loadAdminSettings() {
    const { data } = await supabase.from('admin_settings').select('*').single();
    if (data) {
      setVideoUrl(data.video_url || '');
      setPayLinks({ monthly: data.link_monthly || '#', sixmonth: data.link_sixmonth || '#', yearly: data.link_yearly || '#' });
    }
  }

  const plans = [
    { name: 'Monthly', price: '$10', period: '/ month', duration: '1 Month', color: S.gold, link: payLinks.monthly },
    { name: '6 Months', price: '$39', period: '/ 6 months', duration: '6 Months', color: S.teal, popular: true, link: payLinks.sixmonth },
    { name: '1 Year', price: '$59', period: '/ year', duration: '12 Months', color: S.purple, link: payLinks.yearly },
  ];

  const features = [
    'Full Pomodoro System', 'Active Recall Engine (Theory, Anki, Vignette)',
    'Request Recall Sessions Anytime', 'Personalised Study Timetable',
    'Clock In / Clock Out Tracking', 'Leaderboard Access',
    'Community Access', 'Accountability System',
    'Admin-Curated Content', 'Study Analytics',
  ];

  const reasons = [
    { icon: '🍅', title: 'Pomodoro Technique', desc: 'Structured sessions built around proven time management. Work hard, rest smart, repeat.' },
    { icon: '🧠', title: 'Active Recall Sessions', desc: 'Request a recall session anytime. Theory, Anki-style, or vignette — you choose the format.' },
    { icon: '📅', title: 'Study Timetable', desc: 'Get a personalised follow-up timetable built around your goals and weak areas.' },
    { icon: '🏆', title: 'Leaderboard', desc: 'Compete with other students. Rankings based on real study hours logged.' },
    { icon: '👥', title: 'Community', desc: "You are not studying alone. Be part of a group that holds each other accountable." },
    { icon: '✅', title: 'Accountability', desc: 'Clock in. Clock out. Your real study hours tracked. No lying to yourself.' },
  ];

  return (
    <div style={{ background: S.bg, minHeight: '100vh' }}>
      <style>{css}</style>
      <div className="page-lines" />

      {videoOpen && (
        <div onClick={() => setVideoOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 4, width: '100%', maxWidth: 720, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${S.border}` }}>
              <span style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: S.muted }}>Platform Demo</span>
              <button onClick={() => setVideoOpen(false)} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ aspectRatio: '16/9', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {videoUrl ? (
                <iframe src={videoUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
              ) : (
                <p style={{ fontFamily: S.mono, color: S.dim, fontSize: 11, letterSpacing: 2 }}>VIDEO NOT UPLOADED YET</p>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 20, color: S.gold }}>Deo Fortis</div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#why" style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: S.muted, textDecoration: 'none' }}>Why Join</a>
          <a href="#plans" style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: S.muted, textDecoration: 'none' }}>Plans</a>
          <button className="btn btn-outline" onClick={() => setPage('login')} style={{ padding: '8px 18px' }}>Log In</button>
          <button className="btn btn-gold" onClick={() => setPage('signup')} style={{ padding: '8px 18px' }}>Sign Up</button>
        </div>
      </nav>

      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '140px 48px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 100, right: 0, opacity: 0.1, display: 'flex', alignItems: 'flex-end', gap: 3, borderBottom: '4px solid #3A3020' }}>
          {[{h:160,w:22,c:'#8B4513'},{h:200,w:30,c:'#2F4F4F'},{h:140,w:18,c:'#8B0000'},{h:185,w:26,c:'#4B0082'},{h:220,w:34,c:'#556B2F'},{h:150,w:20,c:'#8B6914'},{h:175,w:28,c:'#1C3A5E'},{h:130,w:16,c:'#6B3A2A'},{h:195,w:24,c:'#2E4A1E'},{h:210,w:32,c:'#4A1942'}].map((b,i)=>(
            <div key={i} style={{ height: b.h, width: b.w, background: b.c, borderRadius: '2px 2px 0 0' }} />
          ))}
        </div>
        <div className="fade" style={{ position: 'relative', zIndex: 1 }}>
          <span className="chapter">— A Premium Study Platform —</span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(52px,9vw,110px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: -1 }}>
            Study with<br /><em style={{ fontStyle: 'italic', color: S.gold }}>Deo Fortis!</em>
          </h1>
          <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, margin: '28px 0', maxWidth: 480 }} />
          <p style={{ fontSize: 16, lineHeight: 1.8, color: S.muted, maxWidth: 520, fontWeight: 300 }}>
            A structured, evidence-based study system built for students who are done making excuses and ready to actually retain what they learn.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#plans" className="btn btn-gold">View Plans →</a>
            <button onClick={() => setVideoOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', border: `1px solid ${S.border}`, borderRadius: 2, fontFamily: S.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: S.muted, cursor: 'pointer', background: 'transparent' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${S.dim}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: S.gold }}>▶</span>
              Watch Demo (Optional)
            </button>
          </div>
          <div style={{ display: 'flex', gap: 48, marginTop: 56, flexWrap: 'wrap' }}>
            {[{num:'3',label:'Recall Formats'},{num:'100%',label:'Premium Access'},{num:'∞',label:'Sessions'}].map((s,i)=>(
              <div key={i} style={{ borderLeft: `2px solid ${S.border}`, paddingLeft: 16 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: S.gold, lineHeight: 1, fontWeight: 700 }}>{s.num}</div>
                <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: 2, textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${S.border}` }} />

      <section id="plans" style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <span className="chapter">Chapter I — Enrolment</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, lineHeight: 1.05, marginBottom: 12 }}>
          Choose Your<br /><em style={{ fontStyle: 'italic', color: S.gold }}>Duration</em>
        </h2>
        <p style={{ fontSize: 15, color: S.muted, maxWidth: 500, marginBottom: 8, fontWeight: 300 }}>Every plan includes the full platform. You are simply choosing how long your access lasts.</p>
        <div className="quote" style={{ maxWidth: 480, marginBottom: 40 }}>"The longer you commit, the less you pay per month."</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 20 }}>
          {plans.map((plan, i) => (
            <div key={i} className="plan-card" style={{ borderColor: plan.popular ? plan.color+'55' : S.border, borderTopWidth: plan.popular ? 3 : 1, borderTopColor: plan.popular ? plan.color : S.border }}>
              {plan.popular && <div className="popular-tag">Best Value</div>}
              <div style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: S.dim, marginBottom: 8, marginTop: plan.popular ? 16 : 0 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, color: plan.color, lineHeight: 1, fontWeight: 700 }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: S.dim, fontWeight: 300 }}>{plan.period}</span>
              </div>
              <div style={{ fontFamily: S.mono, fontSize: 11, color: plan.color, letterSpacing: 1, marginBottom: 24, opacity: 0.8 }}>{plan.duration} of full access</div>
              <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, marginBottom: 20 }} />
              <div style={{ marginBottom: 28 }}>
                {features.map((f, j) => (
                  <div key={j} className="check-item">
                    <span style={{ color: plan.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✦</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <a href={plan.link} className="btn" style={{ background: plan.color, color: '#0F0E0A', width: '100%', textAlign: 'center', display: 'block' }}>
                Enrol — {plan.price}
              </a>
              <p style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, textAlign: 'center', marginTop: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                Approval required · Payment via Selar
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${S.border}` }} />

      <section id="why" style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <span className="chapter">Chapter II — The Method</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, lineHeight: 1.05, marginBottom: 12 }}>
          What You'll<br /><em style={{ fontStyle: 'italic', color: S.gold }}>Actually Get</em>
        </h2>
        <p style={{ fontSize: 15, color: S.muted, maxWidth: 520, marginBottom: 40, fontWeight: 300 }}>This is not a list of features. This is a study system. Every element exists for a reason.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {reasons.map((r, i) => (
            <div key={i} className="reason-card">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{r.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 17, marginBottom: 8, color: S.text }}>{r.title}</h3>
              <p style={{ fontSize: 14, color: '#6A6050', lineHeight: 1.7, fontWeight: 300 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${S.border}` }} />

      <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <span className="chapter">Chapter III — The Process</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, marginBottom: 40 }}>
          How to<br /><em style={{ fontStyle: 'italic', color: S.gold }}>Get Started</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', borderTop: `1px solid ${S.border}`, borderLeft: `1px solid ${S.border}` }}>
          {[
            { num: 'I', title: 'Choose a Plan', desc: 'Pick the duration that works for you. All plans include full access.' },
            { num: 'II', title: 'Pay via Selar', desc: 'Complete your payment securely through Selar. Takes about 2 minutes.' },
            { num: 'III', title: 'Get Approved', desc: 'Your payment is verified and your account is approved automatically.' },
            { num: 'IV', title: 'Begin Studying', desc: 'Log in, complete your setup questionnaire, and start your first session.' },
          ].map((step, i) => (
            <div key={i} style={{ padding: '32px 28px', borderRight: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}` }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 48, color: S.border, lineHeight: 1, marginBottom: 16 }}>{step.num}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: S.text, marginBottom: 8, fontWeight: 600 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#6A6050', lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${S.border}`, padding: 48, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 28, color: S.gold, marginBottom: 10 }}>Deo Fortis</div>
        <div style={{ color: S.gold, opacity: 0.4, letterSpacing: 8, marginBottom: 12 }}>✦ ✦ ✦</div>
        <p style={{ fontSize: 14, color: S.dim, fontWeight: 300 }}>Premium study. Real results. No shortcuts.</p>
        {/* Hidden admin link - only you know this is here */}
     <button onClick={() => setPage('admin')} style={{ background: 'none', border: 'none', color: '#8A7F6E', cursor: 'pointer', fontSize: 11, marginTop: 24, padding: 8, fontFamily: "'Courier New', monospace", letterSpacing: 2, textTransform: 'uppercase' }}>Admin</button>

      </footer>
    </div>
  );
}

function Signup({ setPage }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [payLinks, setPayLinks] = useState({ monthly: '#', sixmonth: '#', yearly: '#' });

  useEffect(() => { loadLinks(); }, []);

  async function loadLinks() {
    const { data } = await supabase.from('admin_settings').select('*').single();
    if (data) setPayLinks({ monthly: data.link_monthly || '#', sixmonth: data.link_sixmonth || '#', yearly: data.link_yearly || '#' });
  }

  async function handleSignup() {
    if (!selectedPlan) { setError('Please select a plan before signing up.'); return; }
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { setError(error.message); setLoading(false); return; }
    await supabase.from('profiles').insert({ id: data.user.id, email: form.email, full_name: form.name, status: 'pending', plan: selectedPlan.name });
    setDone(true);
    setLoading(false);
  }

  const plans = [
    { name: 'Monthly', price: '$10', period: '/ month', duration: '1 Month', color: S.gold, link: payLinks.monthly },
    { name: '6 Months', price: '$39', period: '/ 6 months', duration: '6 Months', color: S.teal, popular: true, link: payLinks.sixmonth },
    { name: '1 Year', price: '$59', period: '/ year', duration: '12 Months', color: S.purple, link: payLinks.yearly },
  ];

  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{css}</style>
      <div className="fade" style={{ width: '100%', maxWidth: 560 }}>
        {done ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 22, color: S.gold, marginBottom: 16 }}>Deo Fortis</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 12 }}>Almost There!</h2>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.8, marginBottom: 24, fontWeight: 300 }}>
              Your account has been created. Now complete your payment to get approved and gain full access.
            </p>
            <a href={selectedPlan?.link} target="_blank" className="btn btn-gold" style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>
              Complete Payment — {selectedPlan?.price} →
            </a>
            <p style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: 1, textTransform: 'uppercase', marginTop: 16 }}>
              You'll be approved as soon as your payment is verified
            </p>
            <button onClick={() => setPage('login')} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: 13, marginTop: 16 }}>
              Already paid? Log in →
            </button>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 22, color: S.gold, marginBottom: 4 }}>Deo Fortis</div>
              <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, margin: '16px 0' }} />
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 4 }}>Create Account</h2>
              <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, fontWeight: 300 }}>Fill in your details and select a plan to get started.</p>
              {error && <div style={{ background: '#2a1010', border: '1px solid #5a2020', borderRadius: 2, padding: '10px 14px', fontSize: 13, color: '#ff8888', marginBottom: 16 }}>{error}</div>}
              <div style={{ marginBottom: 16 }}>
                <label className="label">Full Name</label>
                <input className="input" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: S.gold, marginBottom: 16 }}>Select Your Plan</p>
              <div style={{ display: 'grid', gap: 12 }}>
                {plans.map((plan, i) => (
                  <div key={i} onClick={() => setSelectedPlan(plan)} style={{
                    background: selectedPlan?.name === plan.name ? '#1a1a0f' : S.card,
                    border: `1px solid ${selectedPlan?.name === plan.name ? plan.color : S.border}`,
                    borderRadius: 4, padding: '20px 24px', cursor: 'pointer',
                    transition: 'all 0.2s', position: 'relative',
                    boxShadow: selectedPlan?.name === plan.name ? `0 0 20px ${plan.color}15` : 'none'
                  }}>
                    {plan.popular && (
                      <span style={{ position: 'absolute', top: -1, right: 16, background: S.teal, color: '#0F0E0A', fontFamily: S.mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '0 0 4px 4px' }}>Best Value</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: S.dim, marginBottom: 4 }}>{plan.name}</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: plan.color, fontWeight: 700, lineHeight: 1 }}>
                          {plan.price} <span style={{ fontSize: 13, color: S.dim, fontWeight: 300 }}>{plan.period}</span>
                        </div>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selectedPlan?.name === plan.name ? plan.color : S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {selectedPlan?.name === plan.name && <div style={{ width: 10, height: 10, borderRadius: '50%', background: plan.color }} />}
                      </div>
                    </div>
                    <div style={{ fontFamily: S.mono, fontSize: 10, color: plan.color, letterSpacing: 1, marginTop: 6, opacity: 0.7 }}>{plan.duration} of full access</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-gold" style={{ width: '100%', padding: 16 }} onClick={handleSignup} disabled={loading}>
              {loading ? 'Creating Account...' : `Create Account ${selectedPlan ? '— ' + selectedPlan.price : ''}`}
            </button>

            <p style={{ fontSize: 13, color: S.muted, textAlign: 'center', marginTop: 16 }}>
              Already have an account?{' '}
              <button onClick={() => setPage('login')} style={{ background: 'none', border: 'none', color: S.gold, cursor: 'pointer', fontSize: 13 }}>Log in</button>
            </p>
            <p style={{ textAlign: 'center', marginTop: 8 }}>
              <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: S.dim, cursor: 'pointer', fontSize: 12, fontFamily: S.mono, letterSpacing: 1 }}>← Back to home</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}



function Login({ setPage, fetchProfile }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) { setError(error.message); setLoading(false); return; }
    await fetchProfile(data.user.id);
    setLoading(false);
  }

  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{css}</style>
      <div className="card fade" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 22, color: S.gold, marginBottom: 4 }}>Deo Fortis</div>
        <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, margin: '16px 0' }} />
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 4 }}>Welcome Back</h2>
        <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, fontWeight: 300 }}>Log in to continue your studies.</p>
        {error && <div style={{ background: '#2a1010', border: '1px solid #5a2020', borderRadius: 2, padding: '10px 14px', fontSize: 13, color: '#ff8888', marginBottom: 16 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="Your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button className="btn btn-gold" style={{ width: '100%', marginBottom: 16 }} onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, margin: '16px 0' }} />
        <p style={{ fontSize: 13, color: S.muted, textAlign: 'center', marginTop: 16 }}>
          Don't have an account?{' '}
          <button onClick={() => setPage('signup')} style={{ background: 'none', border: 'none', color: S.gold, cursor: 'pointer', fontSize: 13 }}>Sign up</button>
        </p>
        <p style={{ fontSize: 13, color: S.muted, textAlign: 'center', marginTop: 8 }}>
          <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: S.dim, cursor: 'pointer', fontSize: 12 }}>← Back to home</button>
        </p>
      </div>
    </div>
  );
}

function Pending() {
  async function handleLogout() { await supabase.auth.signOut(); }
  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{css}</style>
      <div className="card fade" style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 22, color: S.gold, marginBottom: 16 }}>Deo Fortis</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 12 }}>Awaiting Approval</h2>
        <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
          Thanks for joining Deo Fortis! Your account is currently pending approval. You'll be approved as soon as your payment is verified.
        </p>
        <div className="quote" style={{ marginBottom: 24, textAlign: 'left' }}>"Great students are patient students."</div>
        <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

function Dashboard({ user, profile, setPage }) {
  const [sessions, setSessions] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      if (clockedIn) setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [clockedIn]);

  async function fetchSessions() {
    const { data } = await supabase.from('study_sessions').select('*').eq('user_id', user.id).order('started_at', { ascending: false }).limit(5);
    if (data) setSessions(data);
  }

  async function clockIn() {
    const { data } = await supabase.from('study_sessions').insert({ user_id: user.id, topic: 'General Study' }).select().single();
    if (data) { setCurrentSession(data); setClockedIn(true); setElapsed(0); }
  }

  async function clockOut() {
    if (!currentSession) return;
    const mins = Math.floor(elapsed / 60);
    await supabase.from('study_sessions').update({ ended_at: new Date().toISOString(), duration_minutes: mins }).eq('id', currentSession.id);
    await supabase.from('profiles').update({ total_study_minutes: (profile.total_study_minutes || 0) + mins }).eq('id', user.id);
    setClockedIn(false); setCurrentSession(null); setElapsed(0);
    fetchSessions();
  }

  const totalHours = Math.floor((profile?.total_study_minutes || 0) / 60);
  const totalMins = (profile?.total_study_minutes || 0) % 60;
  const fmt = s => String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor((s%3600)/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');

  return (
    <div style={{ background: S.bg, minHeight: '100vh' }}>
      <style>{css}</style>
      <div className="page-lines" />
      <nav style={{ background: 'rgba(15,14,10,0.97)', borderBottom: `1px solid ${S.border}`, padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 20, color: S.gold }}>Deo Fortis</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setPage('study')}>📚 Study</button>
          <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setPage('leaderboard')}>🏆 Board</button>
          <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => supabase.auth.signOut()}>Log Out</button>
        </div>
      </nav>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <div className="fade">
          <span className="chapter">Welcome Back</span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 700, marginBottom: 4 }}>
            {profile?.full_name || 'Scholar'} <em style={{ fontStyle: 'italic', color: S.gold, fontSize: 32 }}>📖</em>
          </h1>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 40, fontWeight: 300 }}>
            Plan: <span style={{ color: S.gold, textTransform: 'capitalize' }}>{profile?.plan || 'Active'}</span> · Access expires: <span style={{ color: S.text }}>{profile?.access_expires_at ? new Date(profile.access_expires_at).toLocaleDateString() : 'Active'}</span>
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Study Time', value: `${totalHours}h ${totalMins}m`, color: S.gold },
            { label: 'Sessions Completed', value: sessions.length, color: S.teal },
            { label: 'Status', value: 'Active', color: S.purple },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: stat.color, fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: 2, textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 20 }}>Clock In / Out</h3>
            {clockedIn ? (
              <>
                <div style={{ fontFamily: S.mono, fontSize: 36, color: S.gold, textAlign: 'center', marginBottom: 20 }}>{fmt(elapsed)}</div>
                <button className="btn" style={{ background: '#8B0000', color: '#fff', width: '100%' }} onClick={clockOut}>Clock Out</button>
              </>
            ) : (
              <>
                <p style={{ fontSize: 14, color: S.muted, marginBottom: 20, fontWeight: 300 }}>Ready to study? Clock in to start tracking your session.</p>
                <button className="btn btn-gold" style={{ width: '100%' }} onClick={clockIn}>Clock In</button>
              </>
            )}
          </div>
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 20 }}>Recent Sessions</h3>
            {sessions.length === 0 ? (
              <p style={{ fontSize: 14, color: S.dim, fontWeight: 300 }}>No sessions yet. Clock in to start!</p>
            ) : sessions.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${S.border}`, fontSize: 13 }}>
                <span style={{ color: S.muted }}>{new Date(s.started_at).toLocaleDateString()}</span>
                <span style={{ color: S.gold }}>{s.duration_minutes || 0} mins</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-gold" style={{ width: '100%', padding: 18, fontSize: 13 }} onClick={() => setPage('study')}>
            Start a Study Session →
          </button>
        </div>
      </div>
    </div>
  );
}

function Study({ profile, setPage }) {
  const [step, setStep] = useState('setup');
  const [config, setConfig] = useState({ topic: '', usePomodoro: null, sessions: '30x5', useRecall: null, recallType: 'anki', recallTiming: 'after' });
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [pomSession, setPomSession] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [showRecall, setShowRecall] = useState(false);

  const sessionMap = { '30x5': { work: 30*60, sessions: 5 }, '30x6': { work: 30*60, sessions: 6 }, '60x2': { work: 60*60, sessions: 2 }, '60x3': { work: 60*60, sessions: 3 } };
  const totalSessions = config.usePomodoro ? sessionMap[config.sessions]?.sessions || 5 : 1;
  const workTime = config.usePomodoro ? sessionMap[config.sessions]?.work || 1800 : 60*60;
  const breakTime = 5 * 60;
  const maxTime = isBreak ? breakTime : workTime;

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t >= maxTime - 1) {
            if (!isBreak && config.useRecall === 'yes' && config.recallTiming === 'after' && questions.length > 0) setShowRecall(true);
            if (isBreak) { setIsBreak(false); setPomSession(p => p + 1); return 0; }
            else { setIsBreak(true); return 0; }
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, isBreak, maxTime, questions]);

  async function loadQuestions() {
    const { data } = await supabase.from('recall_questions').select('*').eq('topic', config.topic).eq('type', config.recallType).limit(10);
    if (data && data.length > 0) setQuestions(data);
    else {
      setQuestions([
        { id: 1, question: `What is the most important concept in ${config.topic}?`, answer: 'Review your notes on this topic carefully.', type: config.recallType },
        { id: 2, question: `Explain the key mechanism of ${config.topic} in your own words.`, answer: 'Think through the core principles step by step.', type: config.recallType },
      ]);
    }
  }

  function startStudy() {
    setStep('studying');
    setTimer(0);
    setRunning(true);
    if (config.useRecall === 'yes') loadQuestions();
  }

  function handleAnswer(correct) {
    setAnswered(a => [...a, correct]);
    if (correct) setScore(s => s + 1);
    if (currentQ < questions.length - 1) { setCurrentQ(q => q + 1); setShowAnswer(false); }
    else { setShowRecall(false); setStep('results'); }
  }

  const fmt = s => String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
  const progress = timer / maxTime;
  const r = 80; const circ = 2 * Math.PI * r;

  if (step === 'setup') return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{css}</style>
      <div className="card fade" style={{ width: '100%', maxWidth: 520 }}>
        <button onClick={() => setPage('dashboard')} style={{ background: 'none', border: 'none', color: S.dim, cursor: 'pointer', fontSize: 12, fontFamily: S.mono, letterSpacing: 1, marginBottom: 16 }}>← Back</button>
        <span className="chapter">Study Setup</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, marginBottom: 24 }}>Configure Your Session</h2>
        <div style={{ marginBottom: 20 }}>
          <label className="label">What topic are you studying?</label>
          <input className="input" placeholder="e.g. Bacteriology, Cardiology, Biochemistry" value={config.topic} onChange={e => setConfig({...config, topic: e.target.value})} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="label">Use Pomodoro Technique?</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['yes','no'].map(v => (
              <button key={v} onClick={() => setConfig({...config, usePomodoro: v})} className="btn" style={{ flex: 1, background: config.usePomodoro === v ? S.gold : 'transparent', color: config.usePomodoro === v ? '#0F0E0A' : S.muted, border: `1px solid ${config.usePomodoro === v ? S.gold : S.border}` }}>
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
        {config.usePomodoro === 'yes' && (
          <div style={{ marginBottom: 20 }}>
            <label className="label">Session Structure</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['30x5','30 min × 5'],['30x6','30 min × 6'],['60x2','60 min × 2'],['60x3','60 min × 3']].map(([v,l]) => (
                <button key={v} onClick={() => setConfig({...config, sessions: v})} className="btn" style={{ background: config.sessions === v ? S.gold : 'transparent', color: config.sessions === v ? '#0F0E0A' : S.muted, border: `1px solid ${config.sessions === v ? S.gold : S.border}`, fontSize: 11 }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginBottom: 20 }}>
          <label className="label">Use Active Recall?</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['yes','no'].map(v => (
              <button key={v} onClick={() => setConfig({...config, useRecall: v})} className="btn" style={{ flex: 1, background: config.useRecall === v ? S.gold : 'transparent', color: config.useRecall === v ? '#0F0E0A' : S.muted, border: `1px solid ${config.useRecall === v ? S.gold : S.border}` }}>
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
        {config.useRecall === 'yes' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Recall Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[['theory','Theory'],['anki','Anki'],['vignette','Vignette']].map(([v,l]) => (
                  <button key={v} onClick={() => setConfig({...config, recallType: v})} className="btn" style={{ background: config.recallType === v ? S.gold : 'transparent', color: config.recallType === v ? '#0F0E0A' : S.muted, border: `1px solid ${config.recallType === v ? S.gold : S.border}`, fontSize: 11 }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label">When to do recall?</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['after','After each session'],['end','At the end']].map(([v,l]) => (
                  <button key={v} onClick={() => setConfig({...config, recallTiming: v})} className="btn" style={{ flex: 1, background: config.recallTiming === v ? S.gold : 'transparent', color: config.recallTiming === v ? '#0F0E0A' : S.muted, border: `1px solid ${config.recallTiming === v ? S.gold : S.border}`, fontSize: 11 }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <button className="btn btn-gold" style={{ width: '100%' }} onClick={startStudy} disabled={!config.topic || !config.usePomodoro || !config.useRecall}>
          Start Session →
        </button>
      </div>
    </div>
  );

  if (step === 'studying') return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, flexDirection: 'column' }}>
      <style>{css}</style>
      {showRecall && questions.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ maxWidth: 500, width: '100%' }}>
            <span className="chapter">Active Recall — {config.recallType}</span>
            <p style={{ fontSize: 13, color: S.dim, marginBottom: 20, fontFamily: S.mono, letterSpacing: 1 }}>Question {currentQ + 1} of {questions.length}</p>
            <p style={{ fontSize: 16, color: S.text, lineHeight: 1.7, marginBottom: 20 }}>{questions[currentQ]?.question}</p>
            {!showAnswer ? (
              <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => setShowAnswer(true)}>Show Answer</button>
            ) : (
              <>
                <div style={{ background: '#0F0E0A', border: `1px solid ${S.border}`, borderRadius: 2, padding: 16, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, color: S.teal, lineHeight: 1.7 }}>{questions[currentQ]?.answer}</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn" style={{ flex: 1, background: '#1a3a1a', color: '#7EB8A4', border: '1px solid #2a5a2a' }} onClick={() => { handleAnswer(true); setShowAnswer(false); }}>✓ Got it</button>
                  <button className="btn" style={{ flex: 1, background: '#3a1a1a', color: '#ff8888', border: '1px solid #5a2a2a' }} onClick={() => { handleAnswer(false); setShowAnswer(false); }}>✗ Missed it</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="card fade" style={{ textAlign: 'center', maxWidth: 400, width: '100%' }}>
        <span className="chapter">{isBreak ? '☕ Break Time' : `Session ${pomSession} of ${totalSessions}`}</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 8, color: isBreak ? S.teal : S.text }}>{config.topic}</h2>
        <div style={{ position: 'relative', width: 200, height: 200, margin: '24px auto' }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r={r} fill="none" stroke={S.border} strokeWidth="6" />
            <circle cx="100" cy="100" r={r} fill="none" stroke={isBreak ? S.teal : S.gold} strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round" className="timer-circle" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: S.mono, fontSize: 32, color: isBreak ? S.teal : S.gold }}>{fmt(maxTime - timer)}</div>
            <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: 2, marginTop: 4 }}>{isBreak ? 'BREAK' : 'FOCUS'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <button className="btn btn-gold" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Resume'}</button>
          <button className="btn btn-outline" onClick={() => setPage('dashboard')}>End Session</button>
        </div>
        {config.useRecall === 'yes' && (
          <button className="btn btn-outline" style={{ width: '100%', fontSize: 11 }} onClick={() => setShowRecall(true)}>
            📝 Request Recall Now
          </button>
        )}
      </div>
    </div>
  );

  if (step === 'results') return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{css}</style>
      <div className="card fade" style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <span className="chapter">Session Complete</span>
        <div style={{ fontSize: 56, margin: '16px 0' }}>{score / questions.length >= 0.7 ? '🎉' : '📚'}</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 8 }}>{score} / {questions.length}</h2>
        <p style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
          {Math.round(score/questions.length*100)}% Score
        </p>
        <div className="quote" style={{ textAlign: 'left', marginBottom: 24 }}>
          {score/questions.length >= 0.8 ? '"Excellent recall. Keep this up."' : score/questions.length >= 0.5 ? '"Good effort. Review what you missed."' : '"Study more. Come back stronger."'}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => { setStep('setup'); setScore(0); setCurrentQ(0); setAnswered([]); }}>Study Again</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setPage('dashboard')}>Dashboard</button>
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ setPage }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    supabase.from('leaderboard').select('*').then(({ data }) => { if (data) setRows(data); });
  }, []);

  const medals = ['🥇','🥈','🥉'];

  return (
    <div style={{ background: S.bg, minHeight: '100vh' }}>
      <style>{css}</style>
      <div className="page-lines" />
      <nav style={{ background: 'rgba(15,14,10,0.97)', borderBottom: `1px solid ${S.border}`, padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 20, color: S.gold }}>Deo Fortis</div>
        <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setPage('dashboard')}>← Dashboard</button>
      </nav>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
        <div className="fade">
          <span className="chapter">Chapter IV — Rankings</span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 700, marginBottom: 8 }}>
            The <em style={{ fontStyle: 'italic', color: S.gold }}>Leaderboard</em>
          </h1>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 40, fontWeight: 300 }}>Rankings based on total study hours logged. Updated in real time.</p>
        </div>
        <div className="card">
          {rows.length === 0 ? (
            <p style={{ fontSize: 14, color: S.dim, textAlign: 'center', padding: 20 }}>No data yet. Be the first to clock in!</p>
          ) : rows.map((row, i) => (
            <div key={i} className="leaderboard-row">
              <span style={{ fontSize: 22, width: 32 }}>{medals[i] || `${i+1}.`}</span>
              <span style={{ flex: 1, fontSize: 15, color: S.text }}>{row.full_name}</span>
              <span style={{ fontFamily: S.mono, fontSize: 13, color: S.gold }}>{Math.floor(row.total_study_minutes/60)}h {row.total_study_minutes%60}m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Admin({ setPage }) {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [settings, setSettings] = useState({ video_url: '', link_monthly: '', link_sixmonth: '', link_yearly: '' });
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({ topic: '', type: 'anki', question: '', answer: '' });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('settings');
  const ADMIN_PASS = 'deofortis2024';

  useEffect(() => { if (authed) { loadSettings(); loadUsers(); loadQuestions(); } }, [authed]);

  async function loadSettings() {
    const { data } = await supabase.from('admin_settings').select('*').single();
    if (data) setSettings(data);
  }

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  }

  async function loadQuestions() {
    const { data } = await supabase.from('recall_questions').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setQuestions(data);
  }

  async function saveSettings() {
    await supabase.from('admin_settings').upsert({ id: 1, ...settings });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  async function approveUser(id) {
    const expiresAt = new Date(); expiresAt.setMonth(expiresAt.getMonth() + 1);
    await supabase.from('profiles').update({ status: 'approved', access_expires_at: expiresAt.toISOString() }).eq('id', id);
    loadUsers();
  }

  async function addQuestion() {
    await supabase.from('recall_questions').insert(newQ);
    setNewQ({ topic: '', type: 'anki', question: '', answer: '' });
    loadQuestions();
  }

  if (!authed) return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{css}</style>
      <div className="card fade" style={{ maxWidth: 360, width: '100%' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 22, color: S.gold, marginBottom: 4 }}>Deo Fortis</div>
        <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, margin: '16px 0' }} />
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 16 }}>Admin Access</h2>
        <label className="label">Password</label>
        <input className="input" type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASS && setAuthed(true)}
          style={{ marginBottom: 16 }} />
        <button className="btn btn-gold" style={{ width: '100%', marginBottom: 16 }} onClick={() => { if (password === ADMIN_PASS) setAuthed(true); }}>
          Enter
        </button>
        <p style={{ fontSize: 12, color: S.dim, textAlign: 'center' }}>
          <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: S.dim, cursor: 'pointer', fontSize: 12 }}>← Back to site</button>
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ background: S.bg, minHeight: '100vh' }}>
      <style>{css}</style>
      <nav style={{ background: 'rgba(15,14,10,0.97)', borderBottom: `1px solid ${S.border}`, padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 20, color: S.gold }}>Admin — Deo Fortis</div>
        <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setPage('landing')}>← Back to Site</button>
      </nav>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${S.border}`, padding: '0 48px', display: 'flex', gap: 0 }}>
        {[['settings','⚙ Settings'],['users','👥 Users'],['questions','📝 Questions']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: 'none', border: 'none', borderBottom: tab === id ? `2px solid ${S.gold}` : '2px solid transparent', color: tab === id ? S.gold : S.muted, fontFamily: S.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', padding: '16px 24px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {tab === 'settings' && (
          <div className="card fade">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 24 }}>Site Settings</h2>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Demo Video URL</label>
              <input className="input" placeholder="Paste YouTube embed URL e.g. https://www.youtube.com/embed/..." value={settings.video_url} onChange={e => setSettings({...settings, video_url: e.target.value})} />
              <p style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, marginTop: 6, letterSpacing: 1 }}>For YouTube: go to the video → Share → Embed → copy the src URL</p>
            </div>
            <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, margin: '24px 0' }} />
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 16 }}>Selar Payment Links</h3>
            <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
              {[['link_monthly','Monthly Plan ($10)'],['link_sixmonth','6 Month Plan ($39)'],['link_yearly','1 Year Plan ($59)']].map(([key,label]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input className="input" placeholder="https://selar.co/..." value={settings[key] || ''} onChange={e => setSettings({...settings, [key]: e.target.value})} />
                </div>
              ))}
            </div>
            <button className="btn btn-gold" onClick={saveSettings} style={{ minWidth: 160 }}>
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
          </div>
        )}

        {tab === 'users' && (
          <div className="card fade">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 8 }}>Users</h2>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, fontWeight: 300 }}>{users.filter(u => u.status === 'pending').length} pending approval</p>
            {users.length === 0 ? (
              <p style={{ fontSize: 14, color: S.dim }}>No users yet.</p>
            ) : users.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${S.border}` }}>
                <div>
                  <div style={{ fontSize: 15, color: S.text, marginBottom: 2 }}>{u.full_name}</div>
                  <div style={{ fontSize: 12, color: S.muted }}>{u.email} · Joined {new Date(u.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: u.status === 'approved' ? S.teal : S.gold }}>{u.status}</span>
                  {u.status === 'pending' && (
                    <button className="btn" style={{ background: S.teal, color: '#0F0E0A', padding: '6px 16px', fontSize: 11 }} onClick={() => approveUser(u.id)}>Approve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'questions' && (
          <div className="fade">
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 20 }}>Add Recall Question</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="label">Topic</label>
                  <input className="input" placeholder="e.g. Bacteriology" value={newQ.topic} onChange={e => setNewQ({...newQ, topic: e.target.value})} />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={newQ.type} onChange={e => setNewQ({...newQ, type: e.target.value})} style={{ cursor: 'pointer' }}>
                    <option value="anki">Anki</option>
                    <option value="theory">Theory</option>
                    <option value="vignette">Vignette</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="label">Question</label>
                <textarea className="input" placeholder="Enter the question..." value={newQ.question} onChange={e => setNewQ({...newQ, question: e.target.value})} style={{ minHeight: 80, resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="label">Answer</label>
                <textarea className="input" placeholder="Enter the answer..." value={newQ.answer} onChange={e => setNewQ({...newQ, answer: e.target.value})} style={{ minHeight: 80, resize: 'vertical' }} />
              </div>
              <button className="btn btn-gold" onClick={addQuestion} disabled={!newQ.topic || !newQ.question || !newQ.answer}>
                Add Question
              </button>
            </div>

            {questions.length > 0 && (
              <div className="card">
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 16 }}>Recent Questions ({questions.length})</h3>
                {questions.map((q, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${S.border}` }}>
                    <div style={{ fontSize: 14, color: S.text, marginBottom: 4 }}>{q.question}</div>
                    <div style={{ fontSize: 13, color: S.teal, marginBottom: 4 }}>{q.answer}</div>
                    <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: 1 }}>{q.topic} · {q.type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
