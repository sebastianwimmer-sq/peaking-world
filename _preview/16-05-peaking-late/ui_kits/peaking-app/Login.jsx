function Login({ onLogin }) {
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState(false);
  function submit(e) {
    e.preventDefault();
    if (pw.length < 3) { setErr(true); setTimeout(() => setErr(false), 500); return; }
    onLogin();
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }} className="float-in">
        <img src="../../assets/logo.svg" alt="" style={{ width: 96, height: 96, filter: 'drop-shadow(0 0 24px rgba(255,169,77,0.5))', marginBottom: 20 }} className="peaking-pulse"/>
        <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.02em', margin: 0, background: 'linear-gradient(135deg,#FF6B6B,#FFA94D,#FFD43B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAKING</h1>
        <div style={{ color: '#FFA94D', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', marginTop: 4 }}>Always peaking.</div>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 16, marginBottom: 28, lineHeight: 1.55 }}>Dein persönlicher Insta-Stack. Tracking, Hooks, Captions, Coach — alles in einem.</p>

        <form onSubmit={submit} className={err ? 'shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            type="password"
            placeholder="Passwort"
            autoFocus
            style={{
              background: 'rgba(15,23,42,0.6)', border: `1px solid ${err ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
              color: '#fff', padding: '14px 16px', borderRadius: 12, fontSize: 15, fontFamily: 'inherit',
              outline: 'none', textAlign: 'center',
            }}
          />
          <Btn variant="primary" type="submit" icon="🔓" style={{ width: '100%', justifyContent: 'center', padding: '14px 22px' }}>Login</Btn>
        </form>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#64748b' }}>
          🔐 Geschützter Bereich · Solo-Tool für @vegetarianhulk
          <div style={{ marginTop: 10 }}>⛰️ The climb is the peak.</div>
        </div>
      </div>
    </div>
  );
}
window.Login = Login;
