// Jeton d'entitlement SIGNÉ (JWT RS256) — vérification HORS-LIGNE.
// Voir jemanote/src/entitlementToken.ts pour la version TS commentée.
// Clé publique (JWKS) récupérée dynamiquement, aucun secret dans le client.

const API_BASE = "https://connect-api.jematech.fr";
const ENTITLEMENT_URL = `${API_BASE}/v1/connect/os/entitlement`;
const JWKS_URL = `${API_BASE}/v1/connect/os/entitlement-jwks`;

const TOKEN_KEY = "jemaos_entitlement_jwt";
const JWKS_KEY = "jemaos_entitlement_jwks";
const JWKS_CACHE_MS = 24 * 60 * 60 * 1000;

function b64urlToBytes(input) {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
}

function decodeSegment(segment) {
  try {
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(segment)));
  } catch {
    return undefined;
  }
}

function readJwksCache() {
  try {
    const raw = localStorage.getItem(JWKS_KEY);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    if (!Array.isArray(parsed.keys) || typeof parsed.at !== "number") {
      return null;
    }
    return { keys: parsed.keys, at: parsed.at };
  } catch {
    return null;
  }
}

async function fetchJwks() {
  const cached = readJwksCache();
  const cachedKeys = cached === null ? null : cached.keys;
  if (cached !== null && Date.now() - cached.at < JWKS_CACHE_MS) {
    return cached.keys;
  }
  try {
    const res = await fetch(JWKS_URL, { method: "GET" });
    if (!res.ok) {
      return cachedKeys;
    }
    const data = await res.json();
    if (!Array.isArray(data.keys) || data.keys.length === 0) {
      return cachedKeys;
    }
    try {
      localStorage.setItem(JWKS_KEY, JSON.stringify({ keys: data.keys, at: Date.now() }));
    } catch {
      /* storage indisponible */
    }
    return data.keys;
  } catch {
    return cachedKeys;
  }
}

async function importVerifyKey(jwk) {
  try {
    return await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
  } catch {
    return null;
  }
}

export async function verifySignedEntitlement(jwt) {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    return null;
  }
  const [headerSeg, payloadSeg, signatureSeg] = parts;

  const header = decodeSegment(headerSeg);
  if (typeof header !== "object" || header === null) {
    return null;
  }
  if (header.alg !== "RS256") {
    return null;
  }

  const keys = await fetchJwks();
  if (keys === null || keys.length === 0) {
    return null;
  }
  const first = keys.length > 0 ? keys[0] : undefined;
  const jwk =
    typeof header.kid === "string" ? (keys.find((k) => k.kid === header.kid) ?? first) : first;
  if (jwk === undefined) {
    return null;
  }

  const key = await importVerifyKey(jwk);
  if (key === null) {
    return null;
  }

  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      b64urlToBytes(signatureSeg),
      new TextEncoder().encode(`${headerSeg}.${payloadSeg}`)
    );
  } catch {
    return null;
  }
  if (!valid) {
    return null;
  }

  const claims = decodeSegment(payloadSeg);
  if (typeof claims !== "object" || claims === null) {
    return null;
  }
  if (typeof claims.exp !== "number") {
    return null;
  }
  if (claims.exp * 1000 <= Date.now()) {
    return null;
  }
  return claims;
}

export async function storeSignedEntitlementFromServer(accessToken) {
  try {
    const res = await fetch(ENTITLEMENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const token = data.token;
    if (typeof token !== "string" || token.length === 0) {
      return null;
    }
    const claims = await verifySignedEntitlement(token);
    if (claims === null) {
      return null;
    }
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage indisponible */
    }
    return claims;
  } catch {
    return null;
  }
}

export async function getVerifiedSignedEntitlement() {
  let jwt = null;
  try {
    jwt = localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
  if (jwt === null) {
    return null;
  }
  const claims = await verifySignedEntitlement(jwt);
  if (claims === null) {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage indisponible */
    }
    return null;
  }
  return claims;
}

export function clearSignedEntitlement() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage indisponible */
  }
}
