import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * ============================================================================
 * THE VEDIC SCHOOL — SUNDAY DEMO CONFIRMATION EMAIL (SUPABASE EDGE FUNCTION)
 * ============================================================================
 *
 * Responsibilities:
 * 1. Validates incoming payload (parent_name, child_name, email).
 * 2. Dynamically calculates the upcoming Sunday in Asia/Kolkata timezone.
 * 3. Uses a single configurable Google Meet link for the demo.
 * 4. Dispatches the confirmation email via Resend API using RESEND_API_KEY.
 * 5. Returns a structured JSON response without exposing credentials or PII.
 * ============================================================================
 */

// Single configurable Google Meet link for the Sunday Demo
const DEFAULT_DEMO_MEET_LINK = "https://calendar.app.google/cKPMcXRmfu5tVu6MA";
const DEMO_TIME = "11:00 AM IST";
const DEFAULT_FROM = "The Vedic School <letslearn@thevedicschool.com>";
const DEFAULT_REPLY_TO = "meenakshikhar@gmail.com";

export function getDemoMeetLink(): string {
  return Deno.env.get("DEMO_MEET_LINK") || DEFAULT_DEMO_MEET_LINK;
}

/**
 * Calculates the next relevant Sunday in Asia/Kolkata timezone.
 * Rules:
 * - If before Sunday 11:00 AM IST -> assign upcoming Sunday (or today if Sunday before 11:00 AM).
 * - If on Sunday at or after 11:00 AM IST -> assign following Sunday (+7 days).
 */
export function getUpcomingSundayInIST(referenceDate: Date = new Date()): {
  formattedDate: string;
  isoDate: string;
} {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(referenceDate);
  const partMap: Record<string, string> = {};
  for (const p of parts) {
    partMap[p.type] = p.value;
  }

  const year = parseInt(partMap.year, 10);
  const month = parseInt(partMap.month, 10) - 1; // 0-indexed month
  const day = parseInt(partMap.day, 10);
  const hour = parseInt(partMap.hour, 10);
  const weekday = partMap.weekday; // "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = daysOfWeek.indexOf(weekday);

  let daysUntilSunday = 0;
  if (dayIndex === 0) {
    // Today is Sunday in Asia/Kolkata
    if (hour < 11) {
      daysUntilSunday = 0; // Today before 11:00 AM IST
    } else {
      daysUntilSunday = 7; // Following Sunday
    }
  } else {
    // Days remaining until Sunday: Monday=6, Tuesday=5, ..., Saturday=1
    daysUntilSunday = 7 - dayIndex;
  }

  const targetDate = new Date(Date.UTC(year, month, day + daysUntilSunday));

  const displayFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    formattedDate: displayFormatter.format(targetDate), // e.g. "27 September 2026"
    isoDate: targetDate.toISOString().split("T")[0],
  };
}

/**
 * Builds the plain-text email body exactly matching the approved template.
 */
function buildPlainTextBody(params: {
  parentName: string;
  childName: string;
  demoDate: string;
  demoTime: string;
  meetLink: string;
}): string {
  return `Namaste ${params.parentName},

Thank you for registering. ${params.childName}'s seat for the Sunday Demo is confirmed, and we're looking forward to meeting you both.

**Your demo class**
📅 Sunday, ${params.demoDate}
⏰ ${params.demoTime}
💻 Google Meet: ${params.meetLink}

**Before Sunday**

1. **Save this email** so the link is easy to find on the day.
2. **Join 5 minutes early** so ${params.childName} can settle in and we can start on time.
3. **Use a laptop or tablet** with the camera and microphone working, if you can.
4. **Find a quiet spot** and keep a notebook and pencil nearby.

Can't make it, or have a question? Just reply to this email and we'll help.

See you on Sunday!

Warm regards,
Meenakshi Koul
The Vedic School`;
}

/**
 * Builds a clean, responsive HTML email body.
 */
function buildHtmlBody(params: {
  parentName: string;
  childName: string;
  demoDate: string;
  demoTime: string;
  meetLink: string;
  previewText: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Class Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F3EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2C3338;line-height:1.6;">
  <!-- Preview Text Preheader -->
  <div style="display:none;font-size:1px;color:#F5F3EF;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${params.previewText}
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F5F3EF;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#FFFFFF;border-radius:16px;border:1px solid #E6DDCF;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #F0EAE1;">
              <span style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#1A1D20;letter-spacing:-0.2px;">The Vedic School</span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 32px 24px 32px;">
              <p style="margin:0 0 16px 0;font-size:16px;color:#2C3338;">Namaste ${params.parentName},</p>
              
              <p style="margin:0 0 24px 0;font-size:15px;color:#4A5568;line-height:1.65;">
                Thank you for registering. <strong>${params.childName}'s</strong> seat for the Sunday Demo is confirmed, and we're looking forward to meeting you both.
              </p>

              <!-- Demo Class Details Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBF9F5;border:1px solid #EADBCC;border-radius:12px;margin:0 0 28px 0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px 0;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#C85A32;">Your demo class</p>
                    
                    <div style="font-size:15px;color:#1A1D20;margin-bottom:8px;">
                      📅 <strong>Sunday, ${params.demoDate}</strong>
                    </div>
                    <div style="font-size:15px;color:#1A1D20;margin-bottom:14px;">
                      ⏰ <strong>${params.demoTime}</strong>
                    </div>
                    <div style="font-size:15px;color:#1A1D20;">
                      💻 <strong>Google Meet:</strong> 
                      <a href="${params.meetLink}" target="_blank" rel="noopener noreferrer" style="color:#C85A32;text-decoration:underline;word-break:break-all;">${params.meetLink}</a>
                    </div>

                    <div style="margin-top:18px;">
                      <a href="${params.meetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#C85A32;color:#FFFFFF;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Join Class with Google Meet</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Before Sunday Instructions -->
              <p style="margin:0 0 12px 0;font-size:15px;font-weight:bold;color:#1A1D20;">Before Sunday</p>
              
              <ol style="margin:0 0 24px 0;padding-left:20px;font-size:14px;color:#4A5568;line-height:1.65;">
                <li style="margin-bottom:8px;"><strong>Save this email</strong> so the link is easy to find on the day.</li>
                <li style="margin-bottom:8px;"><strong>Join 5 minutes early</strong> so ${params.childName} can settle in and we can start on time.</li>
                <li style="margin-bottom:8px;"><strong>Use a laptop or tablet</strong> with the camera and microphone working, if you can.</li>
                <li style="margin-bottom:8px;"><strong>Find a quiet spot</strong> and keep a notebook and pencil nearby.</li>
              </ol>

              <p style="margin:0 0 24px 0;font-size:14px;color:#718096;line-height:1.6;">
                Can't make it, or have a question? Just reply to this email and we'll help.
              </p>

              <p style="margin:0 0 16px 0;font-size:15px;color:#2C3338;font-weight:500;">
                See you on Sunday!
              </p>

              <p style="margin:0;font-size:14px;color:#4A5568;line-height:1.5;">
                Warm regards,<br>
                <strong>Meenakshi Koul</strong><br>
                The Vedic School
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#FAF8F5;border-top:1px solid #F0EAE1;font-size:12px;color:#A0AEC0;text-align:center;">
              The Vedic School • Vedic Maths &amp; Curriculum-Aligned Classes<br>
              <a href="https://www.thevedicschool.com" target="_blank" style="color:#A0AEC0;text-decoration:underline;">www.thevedicschool.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// CORS headers for browser invocations via Supabase client
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Retrieve Resend API Key strictly from Supabase Edge Function Secrets
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "RESEND_API_KEY secret is not configured in Supabase Edge Functions",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parentName = (body.parent_name || body.parentName || "").trim();
    const childName = (body.child_name || body.childName || "").trim();
    const recipientEmail = (body.email || "").trim();

    // 2. Validate input
    if (!recipientEmail || !parentName || !childName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: parent_name, child_name, and email are required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Determine the authoritative Sunday Demo date
    // Uses the persisted demo_date passed from the registration record, with Asia/Kolkata fallback
    let demoDate: string;
    let isoDemoDate: string;

    const rawProvidedDate = String(body.demo_date || body.demoDate || "").trim();
    if (rawProvidedDate && rawProvidedDate.includes("-")) {
      const [y, m, d] = rawProvidedDate.split("-").map(Number);
      if (y && m && d) {
        const targetDate = new Date(Date.UTC(y, m - 1, d));
        const displayFormatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "UTC",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        demoDate = displayFormatter.format(targetDate); // e.g. "27 September 2026"
        isoDemoDate = rawProvidedDate;
      } else {
        const fallback = getUpcomingSundayInIST(new Date());
        demoDate = fallback.formattedDate;
        isoDemoDate = fallback.isoDate;
      }
    } else {
      const fallback = getUpcomingSundayInIST(new Date());
      demoDate = fallback.formattedDate;
      isoDemoDate = fallback.isoDate;
    }

    const meetLink = getDemoMeetLink();

    // 4. Construct Subject, Preview Text, and Bodies
    const subject = `Confirmed: ${childName}'s demo class with The Vedic School, Sunday ${demoDate}`;
    const previewText = `Vedic Demo @ ${DEMO_TIME} on Google Meet. Here's everything you need.`;

    const textBody = buildPlainTextBody({
      parentName,
      childName,
      demoDate,
      demoTime: DEMO_TIME,
      meetLink,
    });

    const htmlBody = buildHtmlBody({
      parentName,
      childName,
      demoDate,
      demoTime: DEMO_TIME,
      meetLink,
      previewText,
    });

    const fromAddress = Deno.env.get("RESEND_FROM_EMAIL") || DEFAULT_FROM;
    const replyToAddress = Deno.env.get("RESEND_REPLY_TO") || DEFAULT_REPLY_TO;

    // 5. Send Email via Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipientEmail],
        reply_to: replyToAddress,
        subject: subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Resend API Error]", res.status, data);
      return new Response(
        JSON.stringify({
          success: false,
          status: res.status,
          error: data?.message || "Failed to dispatch email via Resend",
        }),
        {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        resend_id: data.id,
        demo_date: demoDate,
        demo_time: DEMO_TIME,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("[Edge Function Unexpected Error]", err?.message || String(err));
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error dispatching confirmation email",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
