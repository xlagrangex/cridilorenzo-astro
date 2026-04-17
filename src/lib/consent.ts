export const CONSENT_VERSION = "1";
export const CONSENT_KEY = "cc_consent_v1";

export type ConsentState = {
  version: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    openCookiePreferences?: () => void;
  }
}

export function loadConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(
  partial: Partial<Omit<ConsentState, "version" | "necessary" | "updatedAt">>,
): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: !!partial.analytics,
    marketing: !!partial.marketing,
    preferences: !!partial.preferences,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  applyConsent(state);
  return state;
}

export function applyConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: state.marketing ? "granted" : "denied",
      ad_user_data: state.marketing ? "granted" : "denied",
      ad_personalization: state.marketing ? "granted" : "denied",
      analytics_storage: state.analytics ? "granted" : "denied",
      personalization_storage: state.preferences ? "granted" : "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
  }
  window.dispatchEvent(new CustomEvent("cc:consentchange", { detail: state }));
}

export function acceptAll(): ConsentState {
  return saveConsent({ analytics: true, marketing: true, preferences: true });
}

export function rejectAll(): ConsentState {
  return saveConsent({ analytics: false, marketing: false, preferences: false });
}
