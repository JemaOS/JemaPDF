import { useState, useEffect } from 'react';

const API_BASE = 'https://test-connect-api.jematech.fr';
const API_KEY = 'e58492a3-b452-4197-9f4a-deb7915b9446';
const TOKEN_KEY = 'jemaos_access_token';
const TOKEN_EXP_KEY = 'jemaos_token_exp';

function getStoredToken() {
  try {
    const exp = localStorage.getItem(TOKEN_EXP_KEY);
    if (exp && Date.now() > parseInt(exp, 10)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXP_KEY);
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token, expiresIn) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXP_KEY, String(Date.now() + expiresIn * 1000));
  } catch {}
}

async function getAccessToken() {
  const stored = getStoredToken();
  if (stored) return stored;
  const w = window;
  if (w.jemaosToken) return w.jemaosToken;
  if (typeof w.getJemaOSToken === 'function') {
    try { return await w.getJemaOSToken(); } catch { return null; }
  }
  return null;
}

async function checkSubscription(token) {
  try {
    const res = await fetch(`${API_BASE}/v1/connect/os/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.hasSubscription === true;
  } catch {
    return false;
  }
}

async function doLogin(email, password) {
  try {
    let hardwareId = localStorage.getItem('jemaos_hardware_id');
    if (!hardwareId) {
      hardwareId = crypto.randomUUID ? crypto.randomUUID() :
        'hw-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      localStorage.setItem('jemaos_hardware_id', hardwareId);
    }
    const res = await fetch(`${API_BASE}/v1/connect/os-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ email, password, hardware_id: hardwareId }),
    });
    const data = await res.json();
    if (res.ok && data.access_token) {
      storeToken(data.access_token, data.expires_in || 86400);
      return { ok: true };
    }
    return { ok: false, error: data.message || 'Identifiants invalides' };
  } catch {
    return { ok: false, error: 'Erreur de connexion' };
  }
}

const styles = {
  screen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif',
    textAlign: 'center', padding: '2rem',
  },
  input: {
    padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #444',
    background: '#0f0f1e', color: '#fff', fontSize: '1rem', marginBottom: '1rem',
    width: '280px', maxWidth: '100%',
  },
  button: {
    background: '#4f46e5', color: '#fff', padding: '0.75rem 2rem',
    borderRadius: '0.5rem', border: 'none', fontSize: '1.1rem',
    fontWeight: 600, cursor: 'pointer', width: '280px', maxWidth: '100%',
  },
};

function LoginScreen({ appName, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    const result = await doLogin(email, password);
    setLoading(false);
    if (result.ok) onSuccess();
    else setError(result.error || 'Échec de la connexion');
  };

  return (
    <div style={styles.screen}>
      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{appName}</h1>
      <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
        Connectez-vous avec votre compte JemaOS
      </p>
      <input style={styles.input} type="email" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input style={styles.input} type="password" placeholder="Mot de passe"
        value={password} onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()} />
      {error && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>}
      <button style={styles.button} onClick={submit} disabled={loading}>
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </div>
  );
}

function UpgradeScreen({ appName, onRelogin }) {
  return (
    <div style={styles.screen}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{appName}</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2rem', maxWidth: '400px' }}>
        Cette application nécessite un abonnement JemaOS Pro.
      </p>
      <a href="https://www.jemaos.com/tarifs" target="_blank" rel="noopener noreferrer"
         style={{ ...styles.button, textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
        Passer à Pro
      </a>
      <button onClick={onRelogin} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}>
        Changer de compte
      </button>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={styles.screen}>
      <div style={{ fontSize: '1.2rem' }}>Chargement…</div>
    </div>
  );
}

export function SubscriptionGuard({ appName, children }) {
  const [status, setStatus] = useState('loading');

  const verify = async () => {
    const token = await getAccessToken();
    if (!token) { setStatus('login'); return; }
    const allowed = await checkSubscription(token);
    setStatus(allowed ? 'allowed' : 'denied');
  };

  useEffect(() => {
    verify();
    const interval = setInterval(verify, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = () => { setStatus('loading'); verify(); };
  const handleRelogin = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXP_KEY);
    } catch {}
    setStatus('login');
  };

  if (status === 'loading') return <LoadingScreen />;
  if (status === 'login') return <LoginScreen appName={appName} onSuccess={handleLoginSuccess} />;
  if (status === 'denied') return <UpgradeScreen appName={appName} onRelogin={handleRelogin} />;
  return children;
}

export default SubscriptionGuard;
