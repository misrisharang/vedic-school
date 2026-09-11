#!/usr/bin/env python3
"""
Backfill existing Supabase records into Google Sheets via the deployed Google Apps Script Web App.

Usage:
  python3 scripts/backfill_to_sheets.py --web-app-url "<YOUR_WEB_APP_URL>" --service-key "<SUPABASE_SERVICE_ROLE_KEY>"
"""

import sys
import argparse
import urllib.request
import json

class SmartRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        # When Apps Script redirects with 302/303, follow as GET
        return urllib.request.Request(newurl, headers={"User-Agent": "Mozilla/5.0"})

def main():
    parser = argparse.ArgumentParser(description="Backfill Supabase data to Google Sheets")
    parser.add_argument("--web-app-url", required=True, help="Google Apps Script Web App deployment URL (ending in /exec)")
    parser.add_argument("--service-key", required=True, help="Supabase service role key")
    parser.add_argument("--supabase-url", default="https://ozhoummzmwevssuchiss.supabase.co", help="Supabase project URL")
    args = parser.parse_args()

    supabase_url = args.supabase_url.rstrip("/")
    headers = {
        "apikey": args.service_key,
        "Authorization": f"Bearer {args.service_key}"
    }

    opener = urllib.request.build_opener(SmartRedirectHandler())

    print("1. Fetching inquiries from Supabase...")
    inq_req = urllib.request.Request(f"{supabase_url}/rest/v1/inquiries?select=*", headers=headers)
    try:
        with opener.open(inq_req) as resp:
            inquiries = json.loads(resp.read().decode("utf-8"))
            print(f"   Found {len(inquiries)} inquiries.")
    except Exception as e:
        print(f"   Error fetching inquiries: {e}")
        sys.exit(1)

    print("2. Fetching registrations from Supabase...")
    reg_req = urllib.request.Request(f"{supabase_url}/rest/v1/registrations?select=*", headers=headers)
    try:
        with opener.open(reg_req) as resp:
            registrations = json.loads(resp.read().decode("utf-8"))
            demo_count = sum(1 for r in registrations if r.get("registration_type") == "demo")
            assessment_count = sum(1 for r in registrations if r.get("registration_type") == "assessment")
            print(f"   Found {len(registrations)} registrations ({demo_count} demo, {assessment_count} assessment).")
    except Exception as e:
        print(f"   Error fetching registrations: {e}")
        sys.exit(1)

    print("3. Sending backfill batch to Google Apps Script...")
    payload = {
        "action": "backfill",
        "inquiries": inquiries,
        "registrations": registrations
    }

    post_data = json.dumps(payload).encode("utf-8")
    post_req = urllib.request.Request(
        args.web_app_url,
        data=post_data,
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
    )

    try:
        with opener.open(post_req) as resp:
            res_text = resp.read().decode("utf-8")
            print("   Response from Google Sheets:", res_text)
            print("Backfill completed successfully!")
    except Exception as e:
        print(f"   Error posting to Google Apps Script: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
