#!/usr/bin/env node
/**
 * Backfill existing Supabase records into Google Sheets via the deployed Google Apps Script Web App.
 * 
 * Usage:
 *   node scripts/backfill_to_sheets.js <SUPABASE_SERVICE_ROLE_KEY> [WEB_APP_URL]
 */

const fs = require('fs');

const serviceKey = process.argv[2];
const webAppUrl = process.argv[3] || "https://script.google.com/macros/s/AKfycbypqNcdV29slbkgYp-_BoSudEY3pGZS-0OxEXUpz6gEOXaOKm0f7Itt7TxvLX3blxRF/exec";
const supabaseUrl = "https://ozhoummzmwevssuchiss.supabase.co";

if (!serviceKey) {
  console.error("Usage: node scripts/backfill_to_sheets.js <SUPABASE_SERVICE_ROLE_KEY> [WEB_APP_URL]");
  process.exit(1);
}

async function run() {
  const headers = {
    "apikey": serviceKey,
    "Authorization": `Bearer ${serviceKey}`
  };

  console.log("1. Fetching inquiries from Supabase...");
  const inqRes = await fetch(`${supabaseUrl}/rest/v1/inquiries?select=*`, { headers });
  if (!inqRes.ok) {
    throw new Error(`Failed to fetch inquiries: ${inqRes.statusText}`);
  }
  const inquiries = await inqRes.json();
  console.log(`   Found ${inquiries.length} inquiries.`);

  console.log("2. Fetching registrations from Supabase...");
  const regRes = await fetch(`${supabaseUrl}/rest/v1/registrations?select=*`, { headers });
  if (!regRes.ok) {
    throw new Error(`Failed to fetch registrations: ${regRes.statusText}`);
  }
  const registrations = await regRes.json();
  const demoCount = registrations.filter(r => r.registration_type === 'demo').length;
  const assessCount = registrations.filter(r => r.registration_type === 'assessment').length;
  console.log(`   Found ${registrations.length} registrations (${demoCount} demo, ${assessCount} assessment).`);

  console.log("3. Sending batch to Google Apps Script Web App...");
  const payload = {
    action: "backfill",
    inquiries,
    registrations
  };

  const postRes = await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow"
  });

  const resText = await postRes.text();
  console.log("   Google Sheets response:", resText);
  console.log("Backfill completed successfully!");
}

run().catch(err => {
  console.error("Error during backfill:", err);
  process.exit(1);
});
