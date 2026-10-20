/**
 * Canada demo campaign: single source of truth for campaign identity, timing and
 * the automatic pop-up's display rules.
 *
 * All times carry an explicit Eastern offset, so the window is the same instant for
 * every visitor regardless of their own time zone. On 25 Oct 2026 Eastern Time is on
 * daylight time (EDT, UTC-4); the class is 8:30 PM Eastern Time (EDT) = 2026-10-25T20:30:00-04:00 (2026-10-26T00:30:00.000Z UTC).
 */

export const CANADA_CAMPAIGN_ID = 'canada_demo_oct2026';
export const CANADA_CAMPAIGN_COUNTRY = 'CA';
export const CANADA_CAMPAIGN_PATH = '/canada-demo';

/** When the automatic pop-up may start appearing. */
export const CANADA_POPUP_START = new Date('2026-10-19T00:00:00-04:00');
/**
 * Class start: Sunday, October 25, 2026 at 8:30 PM Eastern Time (EDT, UTC-4).
 * UTC conversion: 2026-10-26T00:30:00.000Z (timestamp: 1792974600000 ms).
 * The pop-up remains available until this instant and never appears after the start time.
 */
export const CANADA_EVENT_START = new Date('2026-10-25T20:30:00-04:00');
export const CANADA_POPUP_END = CANADA_EVENT_START;

/** Delay after page load before the pop-up may appear (spec: 5-8 s). */
export const CANADA_POPUP_DELAY_MS = 6000;

/** Event details shown in the pop-up (keep in sync with the /canada-demo page). */
export const CANADA_EVENT_DETAILS = {
  date: 'Sunday, October 25, 2026',
  time: '8:30 PM Eastern Time',
  format: 'Live online session',
  audience: 'For children aged 9 and above',
} as const;

/** Paths where the automatic pop-up must never appear. */
const EXCLUDED_PATH_PREFIXES = [CANADA_CAMPAIGN_PATH, '/admin'];

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

/* -------------------------------------------------------------------------- */
/* Storage keys (functional, first-party only; no identifiers)                 */
/* -------------------------------------------------------------------------- */

/** localStorage: visitor dismissed the pop-up (suppressed until the campaign ends). */
export const POPUP_DISMISSED_KEY = 'tvs_canada_popup_dismissed';
/** localStorage: visitor registered for this campaign on this browser. */
export const CAMPAIGN_REGISTERED_KEY = 'tvs_canada_demo_registered';
/** sessionStorage: pop-up already shown this session (never repeat during navigation). */
export const POPUP_SHOWN_SESSION_KEY = 'tvs_canada_popup_shown';
/** sessionStorage: country returned by /api/visitor-country (one lookup per session). */
export const VISITOR_COUNTRY_SESSION_KEY = 'tvs_visitor_country';
/** sessionStorage: UTM parameters from the visit's landing URL. */
export const CAMPAIGN_UTM_SESSION_KEY = 'tvs_campaign_utm';

/* -------------------------------------------------------------------------- */
/* Eligibility (pure, so it can be tested without a browser)                    */
/* -------------------------------------------------------------------------- */

export interface PopupEligibilityInput {
  now: Date;
  /** Router path, without the deploy base path. */
  path: string;
  /** ISO 3166-1 alpha-2 country from the server-side lookup; null when unknown/failed. */
  country: string | null;
  dismissed: boolean;
  registered: boolean;
  shownThisSession: boolean;
}

export type PopupDecision =
  | { show: true }
  | {
      show: false;
      reason:
        | 'before_campaign'
        | 'campaign_ended'
        | 'excluded_path'
        | 'unknown_country'
        | 'not_target_country'
        | 'dismissed'
        | 'registered'
        | 'already_shown';
    };

export function isExcludedPath(path: string): boolean {
  const clean = path.replace(/\/+$/, '') || '/';
  return EXCLUDED_PATH_PREFIXES.some((p) => clean === p || clean.startsWith(`${p}/`));
}

export function isCampaignActive(now: Date): boolean {
  const t = now.getTime();
  return t >= CANADA_POPUP_START.getTime() && t < CANADA_POPUP_END.getTime();
}

export function evaluatePopupEligibility(input: PopupEligibilityInput): PopupDecision {
  const t = input.now.getTime();
  if (t < CANADA_POPUP_START.getTime()) return { show: false, reason: 'before_campaign' };
  if (t >= CANADA_POPUP_END.getTime()) return { show: false, reason: 'campaign_ended' };
  if (isExcludedPath(input.path)) return { show: false, reason: 'excluded_path' };
  if (input.registered) return { show: false, reason: 'registered' };
  if (input.dismissed) return { show: false, reason: 'dismissed' };
  if (input.shownThisSession) return { show: false, reason: 'already_shown' };
  if (!input.country) return { show: false, reason: 'unknown_country' };
  if (input.country !== CANADA_CAMPAIGN_COUNTRY) return { show: false, reason: 'not_target_country' };
  return { show: true };
}

/** Validates a country code from the lookup endpoint (two uppercase letters only). */
export function normalizeCountryCode(value: unknown): string | null {
  return typeof value === 'string' && /^[A-Z]{2}$/.test(value) ? value : null;
}

/** Builds the CTA link: the landing page plus any UTM parameters from this visit. */
export function buildCampaignCtaHref(utm: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${CANADA_CAMPAIGN_PATH}?${qs}` : CANADA_CAMPAIGN_PATH;
}

/* -------------------------------------------------------------------------- */
/* Safe storage helpers (storage can throw in private mode / when blocked)     */
/* -------------------------------------------------------------------------- */

export function readStorage(kind: 'local' | 'session', key: string): string | null {
  try {
    return (kind === 'local' ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(kind: 'local' | 'session', key: string, value: string): void {
  try {
    (kind === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    /* storage unavailable: the pop-up still respects the per-page-load rules */
  }
}

export function removeStorage(kind: 'local' | 'session', key: string): void {
  try {
    (kind === 'local' ? window.localStorage : window.sessionStorage).removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Called by the /canada-demo form after a confirmed registration. */
export function markCampaignRegistered(): void {
  writeStorage('local', CAMPAIGN_REGISTERED_KEY, CANADA_CAMPAIGN_ID);
}
