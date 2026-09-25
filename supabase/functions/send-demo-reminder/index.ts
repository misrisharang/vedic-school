import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * ============================================================================
 * THE VEDIC SCHOOL — SUNDAY DEMO 30-MINUTE REMINDER (SUPABASE EDGE FUNCTION)
 * ============================================================================
 *
 * Responsibilities:
 * 1. Server-side only scheduled & manual trigger handler.
 * 2. Authenticates requests using service-role verification (rejects public access).
 * 3. Reads RESEND_API_KEY from Supabase Edge Function Secrets.
 * 4. Queries public.registrations using service-role privileges for:
 *      registration_type = 'demo'
 *      demo_date = target Sunday (defaults to today's date in Asia/Kolkata)
 *      reminder_sent_at IS NULL
 * 5. Uses deterministic Resend Idempotency-Key per registration:
 *      demo-reminder-{id}-{demo_date}
 * 6. Dispatches personalized 30-minute reminder email via Resend API.
 * 7. Updates reminder_sent_at ONLY after Resend successfully accepts the email.
 * 8. Handles recipient failures independently without aborting other recipients.
 * 9. Returns a safe execution summary without exposing secrets or PII.
 * ============================================================================
 */

const DEFAULT_DEMO_MEET_LINK = "https://calendar.app.google/cKPMcXRmfu5tVu6MA";
const DEMO_TIME = "11:00 AM IST";
const DEFAULT_FROM = "The Vedic School <letslearn@thevedicschool.com>";
const DEFAULT_REPLY_TO = "meenakshikhar@gmail.com";

export function getDemoMeetLink(): string {
  return Deno.env.get("DEMO_MEET_LINK") || DEFAULT_DEMO_MEET_LINK;
}

/**
 * Computes today's date in Asia/Kolkata timezone in YYYY-MM-DD format.
 */
export function getTodayInIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Validates that the request has an Authorization header containing a valid service_role JWT.
 * Returns the service role token if valid, or null if unauthorized.
 */
function extractServiceRoleToken(req: Request): string | null {
  const authHeader = req.headers.get("Authorization") || "";
  const apiKeyHeader = req.headers.get("apikey") || "";
  const rawToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : apiKeyHeader.trim();

  if (!rawToken) return null;

  try {
    const parts = rawToken.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);

    if (payload && payload.role === "service_role") {
      return rawToken;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Builds the plain-text email body exactly matching the approved template.
 */
function buildPlainTextBody(params: {
  parentName: string;
  childName: string;
  demoTime: string;
  meetLink: string;
}): string {
  return `Namaste ${params.parentName},

${params.childName}'s demo class starts in 30 minutes, at **${params.demoTime}**.

**👉 Join here: ${params.meetLink}**

**Quick check before you join:**

- Camera and microphone are working
- A quiet spot, with a notebook and pencil nearby
- Join 5 minutes early so we can start on time

Running late or can't join? Just reply to this email.

See you shortly!

Warm regards,
Meenakshi Koul
The Vedic School`;
}

/**
 * Builds a clean, responsive HTML email body matching The Vedic School design.
 */
function buildHtmlBody(params: {
  parentName: string;
  childName: string;
  demoTime: string;
  meetLink: string;
  previewText: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Class Starting in 30 Minutes</title>
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
              
              <p style="margin:0 0 24px 0;font-size:16px;color:#1A1D20;line-height:1.6;">
                <strong>${params.childName}'s</strong> demo class starts in 30 minutes, at <strong>${params.demoTime}</strong>.
              </p>

              <!-- Join Class Action Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBF9F5;border:1px solid #EADBCC;border-radius:12px;margin:0 0 28px 0;">
                <tr>
                  <td style="padding:24px;">
                    <div style="font-size:16px;font-weight:bold;color:#1A1D20;margin-bottom:12px;">
                      👉 <a href="${params.meetLink}" target="_blank" rel="noopener noreferrer" style="color:#C85A32;text-decoration:underline;word-break:break-all;">Join here: ${params.meetLink}</a>
                    </div>
                    <div style="margin-top:16px;">
                      <a href="${params.meetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#C85A32;color:#FFFFFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.2px;">Join Demo Class Now</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Quick Checklist -->
              <p style="margin:0 0 12px 0;font-size:15px;font-weight:bold;color:#1A1D20;">Quick check before you join:</p>
              
              <ul style="margin:0 0 24px 0;padding-left:20px;font-size:14px;color:#4A5568;line-height:1.65;">
                <li style="margin-bottom:8px;">Camera and microphone are working</li>
                <li style="margin-bottom:8px;">A quiet spot, with a notebook and pencil nearby</li>
                <li style="margin-bottom:8px;">Join 5 minutes early so we can start on time</li>
              </ul>

              <p style="margin:0 0 24px 0;font-size:14px;color:#718096;line-height:1.6;">
                Running late or can't join? Just reply to this email.
              </p>

              <p style="margin:0 0 16px 0;font-size:15px;color:#2C3338;font-weight:500;">
                See you shortly!
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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 2. Authenticate Request
  // Reject unauthenticated/public visitors. Only callers presenting a valid service_role JWT are authorized.
  const serviceRoleToken = extractServiceRoleToken(req);

  if (!serviceRoleToken) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Service-role authorization required" }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // 3. Verify Resend Secret
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "SUPABASE_URL environment variable is missing",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse optional body parameters
    const body = await req.json().catch(() => ({}));
    let targetDate = getTodayInIST();
    if (body?.target_date && typeof body.target_date === "string") {
      const trimmed = body.target_date.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        targetDate = trimmed;
      }
    }

    // Initialize Supabase Admin Client using verified service-role JWT
    const supabase = createClient(supabaseUrl, serviceRoleToken, {
      auth: { persistSession: false },
    });

    // 4. Query target registrations
    // Strict business rules:
    // - registration_type = 'demo'
    // - demo_date = target Sunday
    // - reminder_sent_at IS NULL
    const { data: recipients, error: dbError } = await supabase
      .from("registrations")
      .select("id, parent_name, child_name, email, demo_date, reminder_sent_at")
      .eq("registration_type", "demo")
      .eq("demo_date", targetDate)
      .is("reminder_sent_at", null);

    if (dbError) {
      console.error("[Database Query Error]", dbError.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to query pending demo registrations",
          details: dbError.message,
          code: dbError.code,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const recipientList = recipients || [];
    const meetLink = getDemoMeetLink();
    const fromAddress = Deno.env.get("RESEND_FROM_EMAIL") || DEFAULT_FROM;
    const replyToAddress = Deno.env.get("RESEND_REPLY_TO") || DEFAULT_REPLY_TO;

    let sentCount = 0;
    let failedCount = 0;

    // 5. Process recipients independently
    for (const recipient of recipientList) {
      const parentName = (recipient.parent_name || "").trim() || "Parent";
      const childName = (recipient.child_name || "").trim() || "your child";
      const email = (recipient.email || "").trim();

      if (!email) {
        failedCount++;
        continue;
      }

      // Deterministic Idempotency Key: demo-reminder-{registration_id}-{demo_date}
      const idempotencyKey = `demo-reminder-${recipient.id}-${recipient.demo_date}`;

      try {
        const subject = `Starting in 30 minutes: ${childName}'s demo class with The Vedic School`;
        const previewText = `Tap to join at ${DEMO_TIME}. We're getting ready for you.`;

        const textBody = buildPlainTextBody({
          parentName,
          childName,
          demoTime: DEMO_TIME,
          meetLink,
        });

        const htmlBody = buildHtmlBody({
          parentName,
          childName,
          demoTime: DEMO_TIME,
          meetLink,
          previewText,
        });

        // 6. Send via Resend with Idempotency Key
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            reply_to: replyToAddress,
            subject: subject,
            text: textBody,
            html: htmlBody,
          }),
        });

        const resendData = await resendRes.json().catch(() => ({}));

        if (!resendRes.ok) {
          console.error(
            `[Resend Delivery Failed] Registration ID: ${recipient.id}, Status: ${resendRes.status}`
          );
          failedCount++;
          continue;
        }

        // 7. Update reminder_sent_at ONLY after Resend successfully accepted the email
        const { error: updateError } = await supabase
          .from("registrations")
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq("id", recipient.id)
          .is("reminder_sent_at", null);

        if (updateError) {
          console.error(
            `[DB Update Error] Registration ID: ${recipient.id}`,
            updateError.message
          );
        }

        sentCount++;
      } catch (recipientErr: any) {
        console.error(
          `[Recipient Processing Error] Registration ID: ${recipient.id}`,
          recipientErr?.message || String(recipientErr)
        );
        failedCount++;
      }
    }

    // 8. Return safe technical summary
    return new Response(
      JSON.stringify({
        success: true,
        target_date: targetDate,
        total: recipientList.length,
        sent: sentCount,
        failed: failedCount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("[send-demo-reminder Fatal Error]", err?.message || String(err));
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error processing demo reminders",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
