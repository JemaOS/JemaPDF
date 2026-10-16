// Session web « Connect » — source d'auth indépendante de l'injection OS.
// Voir jemanote/src/connectSession.ts pour la version TS commentée.

const API_BASE = "https://connect-api.jematech.fr";
const CONNECT_LOGIN_URL = `${API_BASE}/v1/connect/login`;

const asRecord = (value) => (typeof value === "object" && value !== null ? value : {});

export async function connectWebLogin(email, password) {
  const trimmed = String(email ?? "").trim();
  if (trimmed.length === 0 || String(password ?? "").length === 0) {
    return { error: "missing-credentials" };
  }
  try {
    const res = await fetch(CONNECT_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed, password }),
    });
    let parsed = null;
    try {
      parsed = await res.json();
    } catch {
      /* corps non JSON */
    }
    const data = asRecord(parsed);
    if (!res.ok) {
      const code = typeof data.code === "string" ? data.code : "";
      if (res.status === 429 || code === "CAPTCHA_REQUIRED" || code === "CAPTCHA_INVALID") {
        return { captchaRequired: true, error: code.length > 0 ? code : "captcha" };
      }
      const message =
        typeof data.message === "string" ? data.message : `HTTP ${String(res.status)}`;
      return { error: message };
    }
    const accessToken = data.access_token ?? data.accessToken;
    const refreshToken = data.refresh_token ?? data.refreshToken;
    if (typeof accessToken !== "string" || accessToken.length === 0) {
      return { error: "no-token" };
    }
    return {
      accessToken,
      refreshToken: typeof refreshToken === "string" ? refreshToken : null,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "network" };
  }
}

export function persistConnectSession(accessToken, refreshToken) {
  try {
    sessionStorage.setItem("jemaos_access_token", accessToken);
  } catch {
    /* storage indisponible */
  }
  document.cookie = `jemaos_access_token=${accessToken}; Domain=.jemaos.com; Path=/; Secure; SameSite=Lax; Max-Age=86400`;
  if (typeof refreshToken === "string" && refreshToken.length > 0) {
    try {
      sessionStorage.setItem("jemaos_refresh_token", refreshToken);
      localStorage.setItem("jemaos_refresh_token", refreshToken);
    } catch {
      /* storage indisponible */
    }
    document.cookie = `jemaos_refresh_token=${refreshToken}; Domain=.jemaos.com; Path=/; Secure; SameSite=Lax; Max-Age=604800`;
  }
}
