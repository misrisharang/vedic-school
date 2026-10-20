import assert from 'node:assert/strict';
import {
  CANADA_CAMPAIGN_ID,
  CANADA_CAMPAIGN_COUNTRY,
  CANADA_CAMPAIGN_PATH,
  CANADA_POPUP_START,
  CANADA_EVENT_START,
  CANADA_POPUP_END,
  CANADA_EVENT_DETAILS,
  evaluatePopupEligibility,
  isExcludedPath,
  isCampaignActive,
  normalizeCountryCode,
  buildCampaignCtaHref,
} from '../artifacts/vedic-school/src/config/canadaCampaign.ts';

console.log('--- 1. Testing Campaign Dates and Time-Zone Accuracy ---');

// 1. Verify exact UTC and Eastern time representation
console.log('CANADA_EVENT_START ISO:', CANADA_EVENT_START.toISOString());
assert.equal(
  CANADA_EVENT_START.toISOString(),
  '2026-10-26T00:30:00.000Z',
  'Event start must equal 2026-10-26T00:30:00.000Z in UTC'
);

// Verify Eastern Time format
const easternFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZoneName: 'short',
}).format(CANADA_EVENT_START);

console.log('Rendered in America/Toronto:', easternFormat);
assert.match(
  easternFormat,
  /October 25, 2026.*8:30.*p\.m\..*EDT/i,
  'Must format to October 25, 2026 at 8:30 PM EDT'
);

assert.equal(CANADA_POPUP_END.getTime(), CANADA_EVENT_START.getTime(), 'POPUP_END must match EVENT_START');
assert.equal(CANADA_EVENT_DETAILS.time, '8:30 PM Eastern Time', 'EVENT_DETAILS.time must be 8:30 PM Eastern Time');

console.log('✓ Campaign start & cutoff timestamps verified.');

console.log('\n--- 2. Testing Cutoff & Expiry Boundary Conditions ---');

const baseEligibility = {
  path: '/',
  country: 'CA',
  dismissed: false,
  registered: false,
  shownThisSession: false,
};

// 1 second before cutoff
const oneSecBefore = new Date(CANADA_EVENT_START.getTime() - 1000);
const resBefore = evaluatePopupEligibility({ ...baseEligibility, now: oneSecBefore });
assert.deepEqual(resBefore, { show: true }, 'Must show 1s before cutoff');

// Exactly at cutoff
const atCutoff = new Date(CANADA_EVENT_START.getTime());
const resAtCutoff = evaluatePopupEligibility({ ...baseEligibility, now: atCutoff });
assert.deepEqual(resAtCutoff, { show: false, reason: 'campaign_ended' }, 'Must NOT show at cutoff');

// 1 second after cutoff
const oneSecAfter = new Date(CANADA_EVENT_START.getTime() + 1000);
const resAfter = evaluatePopupEligibility({ ...baseEligibility, now: oneSecAfter });
assert.deepEqual(resAfter, { show: false, reason: 'campaign_ended' }, 'Must NOT show after cutoff');

// Before campaign start
const beforeStart = new Date(CANADA_POPUP_START.getTime() - 1000);
const resBeforeStart = evaluatePopupEligibility({ ...baseEligibility, now: beforeStart });
assert.deepEqual(resBeforeStart, { show: false, reason: 'before_campaign' }, 'Must NOT show before campaign start');

console.log('✓ Boundary conditions verified.');

console.log('\n--- 3. Testing Targeting and Suppression Rules ---');

const activeNow = new Date('2026-10-20T12:00:00-04:00');

// Non-target country (US, IN, GB)
assert.deepEqual(
  evaluatePopupEligibility({ ...baseEligibility, now: activeNow, country: 'US' }),
  { show: false, reason: 'not_target_country' }
);
assert.deepEqual(
  evaluatePopupEligibility({ ...baseEligibility, now: activeNow, country: 'IN' }),
  { show: false, reason: 'not_target_country' }
);

// Unknown or failed lookup (null)
assert.deepEqual(
  evaluatePopupEligibility({ ...baseEligibility, now: activeNow, country: null }),
  { show: false, reason: 'unknown_country' },
  'Must fail closed when country is unknown'
);

// Dismissed
assert.deepEqual(
  evaluatePopupEligibility({ ...baseEligibility, now: activeNow, dismissed: true }),
  { show: false, reason: 'dismissed' }
);

// Registered
assert.deepEqual(
  evaluatePopupEligibility({ ...baseEligibility, now: activeNow, registered: true }),
  { show: false, reason: 'registered' }
);

// Already shown this session
assert.deepEqual(
  evaluatePopupEligibility({ ...baseEligibility, now: activeNow, shownThisSession: true }),
  { show: false, reason: 'already_shown' }
);

// Excluded paths
assert.equal(isExcludedPath('/canada-demo'), true);
assert.equal(isExcludedPath('/canada-demo/'), true);
assert.equal(isExcludedPath('/admin'), true);
assert.equal(isExcludedPath('/admin/dashboard'), true);
assert.equal(isExcludedPath('/'), false);
assert.equal(isExcludedPath('/vedic-maths'), false);
assert.equal(isExcludedPath('/about'), false);

assert.deepEqual(
  evaluatePopupEligibility({ ...baseEligibility, now: activeNow, path: '/canada-demo' }),
  { show: false, reason: 'excluded_path' }
);

console.log('✓ Targeting and suppression verified.');

console.log('\n--- 4. Testing Country Normalization and UTM builder ---');

assert.equal(normalizeCountryCode('CA'), 'CA');
assert.equal(normalizeCountryCode('US'), 'US');
assert.equal(normalizeCountryCode('ca'), null);
assert.equal(normalizeCountryCode('CAN'), null);
assert.equal(normalizeCountryCode(''), null);
assert.equal(normalizeCountryCode(null), null);
assert.equal(normalizeCountryCode(undefined), null);

assert.equal(buildCampaignCtaHref({}), '/canada-demo');
assert.equal(
  buildCampaignCtaHref({ utm_source: 'newsletter', utm_medium: 'email' }),
  '/canada-demo?utm_source=newsletter&utm_medium=email'
);

console.log('✓ Helper functions verified.');
console.log('\nALL UNIT ASSERTIONS PASSED SUCCESSFULLY!');
