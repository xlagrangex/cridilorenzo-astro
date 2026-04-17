import { useEffect, useState } from "react";
import {
  acceptAll,
  loadConsent,
  rejectAll,
  saveConsent,
  type ConsentState,
} from "../../lib/consent";

type View = "hidden" | "banner" | "modal";

type Prefs = {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

const initialPrefs: Prefs = {
  analytics: false,
  marketing: false,
  preferences: false,
};

export default function CookieBanner() {
  const [view, setView] = useState<View>("hidden");
  const [prefs, setPrefs] = useState<Prefs>(initialPrefs);

  useEffect(() => {
    const existing = loadConsent();
    if (existing) {
      setPrefs({
        analytics: existing.analytics,
        marketing: existing.marketing,
        preferences: existing.preferences,
      });
    } else {
      setView("banner");
    }
    const openHandler = () => {
      const state = loadConsent();
      if (state) {
        setPrefs({
          analytics: state.analytics,
          marketing: state.marketing,
          preferences: state.preferences,
        });
      }
      setView("modal");
    };
    window.openCookiePreferences = openHandler;
    return () => {
      if (window.openCookiePreferences === openHandler) {
        delete window.openCookiePreferences;
      }
    };
  }, []);

  useEffect(() => {
    if (view === "modal") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [view]);

  const applyFromState = (state: ConsentState) => {
    setPrefs({
      analytics: state.analytics,
      marketing: state.marketing,
      preferences: state.preferences,
    });
    setView("hidden");
  };

  const handleAcceptAll = () => applyFromState(acceptAll());
  const handleRejectAll = () => applyFromState(rejectAll());
  const handleSave = () => applyFromState(saveConsent(prefs));

  if (view === "hidden") return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-md animate-[ccFade_.3s_ease-out]"
        aria-hidden="true"
        onClick={view === "modal" ? () => setView("banner") : undefined}
      />

      {view === "banner" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cc-title"
          className="fixed z-[9999] bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:max-w-md bg-[#15141a] text-white rounded-2xl shadow-2xl border border-white/10 p-6 animate-[ccSlide_.4s_cubic-bezier(0.16,1,0.3,1)]"
        >
          <div className="mb-4">
            <img
              src="/images/logo-dilorenzo.png"
              alt="Christian Dilorenzo"
              className="h-7 w-auto brightness-0 invert mb-3"
            />
            <h2 id="cc-title" className="text-sm font-medium leading-tight text-white/90 m-0">
              Rispettiamo la tua privacy
            </h2>
          </div>
          <p className="text-white/70 text-sm leading-[160%] mb-5 m-0">
            Usiamo cookie tecnici e, con il tuo consenso, strumenti di analisi e
            marketing per migliorare il sito. Puoi accettare, rifiutare o
            scegliere cosa attivare. Dettagli nella{" "}
            <a
              href="https://www.iubenda.com/privacy-policy/19514849/cookie-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-[#3bbfad] transition-colors"
            >
              Cookie Policy
            </a>
            .
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="w-full bg-white text-[#15141a] rounded-[10px] px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Accetta tutto
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleRejectAll}
                className="bg-white/10 text-white rounded-[10px] px-4 py-2.5 text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Rifiuta tutto
              </button>
              <button
                type="button"
                onClick={() => setView("modal")}
                className="bg-transparent border border-white/20 text-white rounded-[10px] px-4 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Personalizza
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "modal" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cc-modal-title"
          className="fixed z-[9999] inset-0 flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <div className="w-full md:max-w-lg bg-[#15141a] text-white md:rounded-2xl rounded-t-2xl shadow-2xl border border-white/10 max-h-[90vh] flex flex-col animate-[ccSlide_.4s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <h2 id="cc-modal-title" className="text-lg font-medium m-0">
                Preferenze cookie
              </h2>
              <button
                type="button"
                onClick={() => setView("banner")}
                aria-label="Chiudi"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M6 18L18 6"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 flex-1">
              <p className="text-white/60 text-sm leading-[160%] m-0 mb-5">
                Scegli quali categorie di cookie attivare. I cookie necessari
                non possono essere disattivati perché indispensabili al
                funzionamento del sito.
              </p>

              <Row
                title="Necessari"
                desc="Strumenti essenziali: invio del form contatti, iscrizione newsletter, memorizzazione delle preferenze di consenso."
                always
              />
              <Row
                title="Analitici"
                desc="Ci aiutano a capire come viene usato il sito in modo aggregato (es. Google Analytics). Nessun dato personale identificabile."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <Row
                title="Marketing"
                desc="Permettono di misurare l'efficacia delle campagne e mostrarti contenuti pertinenti (es. Google Ads, Meta Pixel)."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
              <Row
                title="Preferenze"
                desc="Ricordano scelte non essenziali come lingua o layout per personalizzare l'esperienza."
                checked={prefs.preferences}
                onChange={(v) => setPrefs((p) => ({ ...p, preferences: v }))}
              />
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex flex-col md:flex-row gap-2 md:justify-between">
              <button
                type="button"
                onClick={handleRejectAll}
                className="bg-white/10 text-white rounded-[10px] px-4 py-2.5 text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Rifiuta tutto
              </button>
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-transparent border border-white/20 text-white rounded-[10px] px-4 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Salva scelta
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="bg-white text-[#15141a] rounded-[10px] px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Accetta tutto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ccSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ccFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

type RowProps = {
  title: string;
  desc: string;
  checked?: boolean;
  always?: boolean;
  onChange?: (v: boolean) => void;
};

function Row({ title, desc, checked, always, onChange }: RowProps) {
  const on = always ? true : !!checked;
  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-1.5">
        <h3 className="text-base font-medium m-0">{title}</h3>
        {always ? (
          <span className="text-[0.7rem] uppercase tracking-wider text-[#3bbfad] font-semibold flex-shrink-0 pt-1">
            Sempre attivi
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={`Attiva cookie ${title}`}
            onClick={() => onChange?.(!on)}
            className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
              on ? "bg-[#2a9d8f]" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                on ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        )}
      </div>
      <p className="text-white/55 text-xs leading-[160%] m-0">{desc}</p>
    </div>
  );
}
