import { useState, useEffect } from 'react';

const API_BASE = 'https://test-connect-api.jematech.fr';
const API_KEY = 'e58492a3-b452-4197-9f4a-deb7915b9446';

async function getAccessToken() {
  // Method 1: Direct function (injected by ChromeOS)
  if (window.getJemaOSToken) {
    try {
      return await window.getJemaOSToken();
    } catch {
      return null;
    }
  }

  // Method 2: Direct property (injected by ChromeOS)
  if (window.jemaosToken) {
    return window.jemaosToken;
  }

  // Method 3: sessionStorage (same-origin only)
  try {
    const sessionToken = sessionStorage.getItem('jemaos_access_token');
    if (sessionToken) return sessionToken;
  } catch {}

  // Method 4: localStorage (same-origin only, but persists)
  try {
    const localToken = localStorage.getItem('jemaos_access_token');
    if (localToken) return localToken;
  } catch {}

  // Method 5: Cross-origin postMessage to parent window
  const token = await new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 3000);

    const handler = (event) => {
      if (event.data && event.data.type === 'jemaos_token_response') {
        clearTimeout(timeout);
        window.removeEventListener('message', handler);
        resolve(event.data.token || null);
      }
    };

    window.addEventListener('message', handler);

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'jemaos_token_request' }, '*');
    }
    if (window.opener) {
      window.opener.postMessage({ type: 'jemaos_token_request' }, '*');
    }
    const topWin = window.top;
    if (topWin && topWin !== window) {
      topWin.postMessage({ type: 'jemaos_token_request' }, '*');
    }

    if (window.parent === window && !window.opener) {
      clearTimeout(timeout);
      window.removeEventListener('message', handler);
      resolve(null);
    }
  });

  return token;
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

function UpgradeScreen({ appName }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{appName}</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2rem', maxWidth: '400px' }}>
        Cette application nécessite un abonnement JemaOS Pro.
      </p>
      <a
        href="https://www.jemaos.com/tarifs"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#4f46e5',
          color: '#fff',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        Passer à Pro
      </a>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#1a1a2e',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ fontSize: '1.2rem' }}>Chargement…</div>
    </div>
  );
}

export function SubscriptionGuard({ appName, children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const token = await getAccessToken();
      if (!token) {
        if (!cancelled) setStatus('denied');
        return;
      }
      const allowed = await checkSubscription(token);
      if (!cancelled) setStatus(allowed ? 'allowed' : 'denied');
    };

    verify();
    const interval = setInterval(verify, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (status === 'loading') return <LoadingScreen />;
  if (status === 'denied') return <UpgradeScreen appName={appName} />;
  return children;
}

export default SubscriptionGuard;
