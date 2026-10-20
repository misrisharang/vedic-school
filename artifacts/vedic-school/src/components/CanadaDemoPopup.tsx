import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useLocation } from 'wouter';
import { Calendar, Clock, Video, Users, X } from 'lucide-react';
import meenakshiPortrait from '@assets/meenakshi-founder-portrait.jpg';
import {
  CANADA_CAMPAIGN_ID,
  CANADA_EVENT_DETAILS,
  CANADA_POPUP_DELAY_MS,
  CAMPAIGN_REGISTERED_KEY,
  CAMPAIGN_UTM_SESSION_KEY,
  POPUP_DISMISSED_KEY,
  POPUP_SHOWN_SESSION_KEY,
  UTM_KEYS,
  VISITOR_COUNTRY_SESSION_KEY,
  buildCampaignCtaHref,
  evaluatePopupEligibility,
  isExcludedPath,
  normalizeCountryCode,
  readStorage,
  removeStorage,
  writeStorage,
} from '@/config/canadaCampaign';
import { trackCampaignPopupEvent } from '@/lib/analytics';

/**
 * Canada campaign pop-up.
 *
 * Shown once, ~6 s after the first page load, only when the server-side country lookup
 * (/api/visitor-country, Netlify edge geolocation) says the visitor is in Canada, the
 * campaign window is open, the visitor is not on /canada-demo or /admin, and they have
 * not dismissed it or registered. Any lookup failure means no pop-up.
 */

const COUNTRY_LOOKUP_TIMEOUT_MS = 4000;

/* ---------------- development-only test hooks (stripped from production builds) --------------- */
// import.meta.env.DEV is a build-time constant: in `vite build` every branch below is dead code.
//   ?tvs_geo=CA | US | unknown   simulate the country lookup result for this session
//   ?tvs_popup_reset=1           clear dismissal / registration / shown flags
//   ?tvs_popup_delay=500         override the delay (ms)
//   ?tvs_now=2026-10-26T00:00:00-04:00  simulate the current time (expiry testing)
const DEV_GEO_KEY = 'tvs_dev_geo';

function applyDevOverrides() {
  if (!import.meta.env.DEV) return;
  const params = new URLSearchParams(window.location.search);
  const geo = params.get('tvs_geo');
  if (geo) writeStorage('session', DEV_GEO_KEY, geo);
  if (params.get('tvs_popup_reset') === '1') {
    removeStorage('local', POPUP_DISMISSED_KEY);
    removeStorage('local', CAMPAIGN_REGISTERED_KEY);
    removeStorage('session', POPUP_SHOWN_SESSION_KEY);
    removeStorage('session', VISITOR_COUNTRY_SESSION_KEY);
  }
}

function currentTime(): Date {
  if (!import.meta.env.DEV) return new Date();
  const override = new URLSearchParams(window.location.search).get('tvs_now');
  if (override) {
    const d = new Date(override);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

function popupDelay(): number {
  if (!import.meta.env.DEV) return CANADA_POPUP_DELAY_MS;
  const override = Number(new URLSearchParams(window.location.search).get('tvs_popup_delay') ?? NaN);
  return Number.isFinite(override) && override >= 0 ? override : CANADA_POPUP_DELAY_MS;
}
/* ----------------------------------------------------------------------------------------------- */

/** Keeps the UTM parameters of the visit's landing URL for the rest of the session. */
function captureUtmFromLandingUrl() {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 120);
  }
  if (Object.keys(utm).length > 0) {
    writeStorage('session', CAMPAIGN_UTM_SESSION_KEY, JSON.stringify(utm));
  }
}

function readSessionUtm(): Record<string, string> {
  try {
    const raw = readStorage('session', CAMPAIGN_UTM_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function lookupCountry(): Promise<string | null> {
  if (import.meta.env.DEV) {
    const simulated = readStorage('session', DEV_GEO_KEY);
    if (simulated) return normalizeCountryCode(simulated.toUpperCase());
  }

  const cached = normalizeCountryCode(readStorage('session', VISITOR_COUNTRY_SESSION_KEY));
  if (cached) return cached;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), COUNTRY_LOOKUP_TIMEOUT_MS);
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}api/visitor-country`, {
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) return null;
    const data = await res.json();
    const country = normalizeCountryCode(data?.country);
    if (country) writeStorage('session', VISITOR_COUNTRY_SESSION_KEY, country);
    return country;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

function preloadImage(src: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    window.setTimeout(done, timeoutMs);
    img.src = src;
  });
}

/**
 * True when another dialog is actually open on screen (e.g. the Sunday demo modal or the
 * mobile menu). Always-mounted but hidden dialogs (the closed mobile drawer) don't count.
 */
function isAnotherDialogOpen(): boolean {
  return Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], [aria-modal="true"]')).some((el) => {
    if (el.getAttribute('data-state') === 'open') return true;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
  });
}

function persistedFlags() {
  return {
    dismissed: readStorage('local', POPUP_DISMISSED_KEY) === CANADA_CAMPAIGN_ID,
    registered: readStorage('local', CAMPAIGN_REGISTERED_KEY) === CANADA_CAMPAIGN_ID,
    shownThisSession: readStorage('session', POPUP_SHOWN_SESSION_KEY) === '1',
  };
}

const DETAIL_ITEMS = [
  { Icon: Calendar, text: CANADA_EVENT_DETAILS.date },
  { Icon: Clock, text: CANADA_EVENT_DETAILS.time },
  { Icon: Video, text: CANADA_EVENT_DETAILS.format },
  { Icon: Users, text: CANADA_EVENT_DETAILS.audience },
];

export function CanadaDemoPopup() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const locationRef = useRef(location);
  const impressionSent = useRef(false);
  const closedByCta = useRef(false);

  useEffect(() => {
    locationRef.current = location;
    // Never sit on top of the landing page's own form (closing here is not a dismissal).
    if (open && isExcludedPath(location)) setOpen(false);
  }, [location, open]);

  // One attempt per full page load; SPA navigation does not restart it.
  useEffect(() => {
    applyDevOverrides();
    captureUtmFromLandingUrl();

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const base = { now: currentTime(), path: locationRef.current, ...persistedFlags() };
      // Cheap checks first, so ineligible visitors never trigger the lookup.
      const pre = evaluatePopupEligibility({ ...base, country: 'CA' });
      if (!pre.show) return;

      const country = await lookupCountry();
      if (cancelled) return;

      const decision = evaluatePopupEligibility({
        ...persistedFlags(),
        now: currentTime(),
        path: locationRef.current,
        country,
      });
      // Don't stack on top of another open dialog (e.g. the Sunday demo modal).
      if (!decision.show || isAnotherDialogOpen()) return;

      // Warm the portrait so it doesn't pop in after the dialog appears.
      await preloadImage(meenakshiPortrait, 1500);
      if (cancelled || isExcludedPath(locationRef.current) || isAnotherDialogOpen()) return;

      writeStorage('session', POPUP_SHOWN_SESSION_KEY, '1');
      setOpen(true);
    }, popupDelay());

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (open && !impressionSent.current) {
      impressionSent.current = true;
      trackCampaignPopupEvent('canada_demo_popup_impression', CANADA_CAMPAIGN_ID);
    }
  }, [open]);

  const handleOpenChange = useCallback((next: boolean) => {
    if (next) return;
    setOpen(false);
    writeStorage('local', POPUP_DISMISSED_KEY, CANADA_CAMPAIGN_ID);
    if (!closedByCta.current) {
      trackCampaignPopupEvent('canada_demo_popup_dismiss', CANADA_CAMPAIGN_ID);
    }
  }, []);

  const handleCta = useCallback(() => {
    const href = buildCampaignCtaHref(readSessionUtm());
    trackCampaignPopupEvent('canada_demo_popup_cta_click', CANADA_CAMPAIGN_ID);
    closedByCta.current = true;
    // Engaged visitors are not asked again; the landing page carries the form.
    writeStorage('local', POPUP_DISMISSED_KEY, CANADA_CAMPAIGN_ID);
    setOpen(false);
    setLocation(href);
  }, [setLocation]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-[#1E2B3C]/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[61] -translate-x-1/2 -translate-y-1/2 w-[calc(100%-1.5rem)] max-w-[880px] max-h-[calc(100dvh-1.5rem)] flex overflow-hidden rounded-3xl bg-[#FBF7F1] border border-[#EFE5D8] shadow-[0_24px_60px_-20px_rgba(30,43,60,0.45)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-300 motion-reduce:animate-none"
        >
          <DialogPrimitive.Close
            className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 w-10 h-10 rounded-full bg-white text-[#1E2B3C] shadow-md flex items-center justify-center hover:bg-[#FAF6F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B04C27] focus-visible:ring-offset-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </DialogPrimitive.Close>

          <div className="grid sm:grid-cols-[1.35fr_1fr] w-full overflow-y-auto overscroll-contain">
            {/* Copy */}
            <div className="px-5 pt-14 pb-0 sm:p-8 lg:p-10 flex flex-col">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#FCE6DC] px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-[#A84824] mb-4 sm:mb-5">
                <span aria-hidden="true">🇨🇦</span>
                <span>A special invitation for Canadian families</span>
              </div>

              <DialogPrimitive.Title className="font-serif text-[27px] sm:text-[40px] lg:text-[46px] font-semibold leading-[1.08] tracking-tight text-[#1E2B3C] mb-3 sm:mb-4">
                What if Maths felt{' '}
                <span className="relative inline-block text-[#B04C27]">
                  easier
                  <svg
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    className="absolute left-0 -bottom-1.5 w-full h-2.5 text-[#B04C27]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8 C 50 3, 120 2, 197 6" />
                  </svg>
                </span>{' '}
                for your child?
              </DialogPrimitive.Title>

              <DialogPrimitive.Description className="text-[14px] sm:text-[15px] text-foreground/80 leading-relaxed mb-4 sm:mb-5 max-w-[46ch]">
                Join Meenakshi Koul for a free online Vedic Maths demo class. Explore how number patterns and structured calculation methods can help children build fluency, understanding and confidence with Maths.
              </DialogPrimitive.Description>

              <ul className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-3 rounded-2xl bg-white/70 border border-[#EFE5D8] p-3 sm:p-4 mb-4 sm:mb-6">
                {DETAIL_ITEMS.map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FBECE3] flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px] text-[#B04C27]" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-semibold leading-snug text-foreground">{text}</span>
                  </li>
                ))}
              </ul>

              {/* Phones: CTA pinned to the bottom of the dialog so it is always visible */}
              <div className="sticky bottom-0 -mx-5 px-5 pt-3 pb-4 bg-[#FBF7F1] border-t border-[#EFE5D8] sm:static sm:mx-0 sm:px-0 sm:pt-0 sm:pb-0 sm:bg-transparent sm:border-0 mt-auto">
              <button
                type="button"
                onClick={handleCta}
                className="self-start inline-flex items-center justify-center gap-2 rounded-full bg-[#B04C27] hover:bg-[#9A4122] active:scale-[0.98] px-8 py-3.5 text-white font-serif font-medium text-base sm:text-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B04C27] focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                Reserve Your Spot <span aria-hidden="true">→</span>
              </button>
              <p className="mt-2 sm:mt-3 text-xs text-foreground/75 text-center sm:text-left sm:pl-4">Free to attend. Registration required.</p>
              </div>
            </div>

            {/* Portrait (hidden on small phones so the CTA stays in view) */}
            <div className="relative hidden sm:block min-h-[420px] overflow-hidden">
              <div className="absolute -right-16 top-10 w-72 h-72 rounded-full bg-[#DCE6D8]" />
              <div className="absolute -left-10 -bottom-16 w-64 h-56 rounded-[50%] bg-[#F3D9C8]" />
              <div className="absolute left-[-6%] bottom-0 w-[46%] aspect-square rounded-full bg-[#D9784F]/80" />
              <div className="absolute inset-x-[10%] top-[14%] bottom-0 rounded-t-full overflow-hidden ring-4 ring-[#FBF7F1]/70">
                <img
                  src={meenakshiPortrait}
                  alt="Meenakshi Koul, founder and educator at The Vedic School"
                  width={768}
                  height={1280}
                  className="w-full h-full object-cover object-[50%_12%]"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
