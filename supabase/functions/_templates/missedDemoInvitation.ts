/**
 * ============================================================================
 * THE VEDIC SCHOOL — SUNDAY LEARNING NOTES: MISSED DEMO INVITATION TEMPLATE
 * ============================================================================
 *
 * Internal Name: Sunday Learning Notes — Missed Demo Invitation
 * Purpose: Re-engagement / nurture email for parents who previously registered
 *          for a Vedic Maths demo class but did not attend.
 * Status: DRAFT / REUSABLE TEMPLATE MODULE (Not connected to automated cron)
 * ============================================================================
 */

export interface MissedDemoInvitationParams {
  parentName?: string;
  demoDate?: string;
  demoTime?: string;
  meetLink?: string;
}

export const MISSED_DEMO_TEMPLATE_METADATA = {
  id: "sunday-learning-notes-missed-demo",
  name: "Sunday Learning Notes — Missed Demo Invitation",
  subject: "Couldn't make it to our last demo? Join us this Sunday!",
  previewText: "There's another opportunity for your child to explore Maths differently.",
  defaultDate: "Sunday, 25 October 2026",
  defaultTime: "11:00 AM – 12:00 PM IST",
  defaultMeetLink: "https://meet.google.com/cer-swuk-vpx",
  defaultFrom: "The Vedic School <Amresh@thevedicschool.com>",
  defaultReplyTo: "meenakshikhar@gmail.com",
};

/**
 * Builds the plain-text fallback version of the email.
 */
export function buildMissedDemoPlainText(params: MissedDemoInvitationParams = {}): string {
  const parentName = params.parentName || "Parent";
  const demoDate = params.demoDate || MISSED_DEMO_TEMPLATE_METADATA.defaultDate;
  const demoTime = params.demoTime || MISSED_DEMO_TEMPLATE_METADATA.defaultTime;
  const meetLink = params.meetLink || MISSED_DEMO_TEMPLATE_METADATA.defaultMeetLink;

  return `Hi ${parentName},

Have you ever heard your child say, "I don't like Maths" or "This is too hard to understand"?

Maths can sometimes feel like a subject full of formulas and steps to remember. But what if children could explore numbers in a different way?

At The Vedic School, I introduce children to Vedic Maths through patterns, mental calculation techniques, and simple ways to explore numbers. The aim is to build calculation fluency, encourage curiosity, and help children feel more confident with Maths.

If you couldn't join us for our previous demo, here's another opportunity!

Join me for a free Vedic Maths Demo Class this Sunday.

📅 ${demoDate}
🕚 ${demoTime}

Join the Sunday Demo Class:
${meetLink}

I look forward to exploring a new way to experience Maths with your child!

Warm regards,
Meenakshi Koul
The Vedic School
+91 83348 93336

---
The Vedic School • Vedic Maths & Curriculum-Aligned Classes
https://www.thevedicschool.com
To manage your preferences or if you received this in error, please reply directly to this email.`;
}

/**
 * Builds the responsive HTML version of the email matching The Vedic School brand system.
 */
export function buildMissedDemoHtml(params: MissedDemoInvitationParams = {}): string {
  const parentName = params.parentName || "Parent";
  const demoDate = params.demoDate || MISSED_DEMO_TEMPLATE_METADATA.defaultDate;
  const demoTime = params.demoTime || MISSED_DEMO_TEMPLATE_METADATA.defaultTime;
  const meetLink = params.meetLink || MISSED_DEMO_TEMPLATE_METADATA.defaultMeetLink;
  const previewText = MISSED_DEMO_TEMPLATE_METADATA.previewText;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Couldn't make it to our last demo? Join us this Sunday!</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F5F3EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2C3338;line-height:1.6;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <!-- Preheader Preview Text -->
  <div style="display:none;font-size:1px;color:#F5F3EF;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${previewText}
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F5F3EF;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#FFFFFF;border-radius:16px;border:1px solid #E6DDCF;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #F0EAE1;">
              <span style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#1A1D20;letter-spacing:-0.2px;">The Vedic School</span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 32px 24px 32px;">
              <p style="margin:0 0 18px 0;font-size:16px;color:#2C3338;line-height:1.6;">
                Hi ${parentName},
              </p>
              
              <p style="margin:0 0 18px 0;font-size:16px;color:#2C3338;line-height:1.6;">
                Have you ever heard your child say, <em>&ldquo;I don't like Maths&rdquo;</em> or <em>&ldquo;This is too hard to understand&rdquo;</em>?
              </p>

              <p style="margin:0 0 18px 0;font-size:16px;color:#2C3338;line-height:1.6;">
                Maths can sometimes feel like a subject full of formulas and steps to remember. But what if children could explore numbers in a different way?
              </p>

              <p style="margin:0 0 22px 0;font-size:16px;color:#2C3338;line-height:1.6;">
                At <strong style="color:#1A1D20;">The Vedic School</strong>, I introduce children to Vedic Maths through patterns, mental calculation techniques, and simple ways to explore numbers. The aim is to build calculation fluency, encourage curiosity, and help children feel more confident with Maths.
              </p>

              <p style="margin:0 0 22px 0;font-size:16px;color:#2C3338;line-height:1.6;">
                If you couldn't join us for our previous demo, here's another opportunity!
              </p>

              <!-- Demo Class Highlight Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBF9F5;border:1px solid #EADBCC;border-radius:12px;margin:0 0 26px 0;">
                <tr>
                  <td style="padding:22px 24px;">
                    <div style="font-size:17px;font-weight:bold;color:#1A1D20;margin-bottom:14px;font-family:Georgia,serif;">
                      Join me for a free Vedic Maths Demo Class this Sunday.
                    </div>
                    
                    <div style="font-size:15px;color:#2C3338;margin-bottom:8px;">
                      📅 <strong>${demoDate}</strong>
                    </div>
                    
                    <div style="font-size:15px;color:#2C3338;margin-bottom:20px;">
                      🕚 <strong>${demoTime}</strong>
                    </div>

                    <!-- CTA Button -->
                    <div style="margin-top:12px;margin-bottom:14px;">
                      <a href="${meetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#C85A32;color:#FFFFFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.2px;text-align:center;">Join the Sunday Demo Class</a>
                    </div>

                    <!-- Plain Text Fallback Link -->
                    <div style="font-size:13px;color:#718096;word-break:break-all;line-height:1.5;">
                      Or copy and paste this link: <a href="${meetLink}" target="_blank" rel="noopener noreferrer" style="color:#C85A32;text-decoration:underline;">${meetLink}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0;font-size:16px;color:#2C3338;line-height:1.6;">
                I look forward to exploring a new way to experience Maths with your child!
              </p>

              <!-- Sign-off -->
              <p style="margin:0;font-size:15px;color:#4A5568;line-height:1.6;">
                Warm regards,<br>
                <strong style="color:#1A1D20;font-size:16px;">Meenakshi Koul</strong><br>
                The Vedic School<br>
                <span style="color:#718096;">+91 83348 93336</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 32px;background-color:#FAF8F5;border-top:1px solid #F0EAE1;font-size:12px;color:#A0AEC0;text-align:center;line-height:1.6;">
              The Vedic School • Vedic Maths &amp; Curriculum-Aligned Classes<br>
              <a href="https://www.thevedicschool.com" target="_blank" rel="noopener noreferrer" style="color:#A0AEC0;text-decoration:underline;">www.thevedicschool.com</a>
              <br><br>
              You are receiving this because you registered for a Vedic Maths demo class with The Vedic School.<br>
              To update your preferences or unsubscribe, please reply directly to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Returns the complete payload ready for Resend API dispatch.
 */
export function getMissedDemoResendPayload(recipientEmail: string, params: MissedDemoInvitationParams = {}) {
  return {
    from: MISSED_DEMO_TEMPLATE_METADATA.defaultFrom,
    to: [recipientEmail],
    reply_to: MISSED_DEMO_TEMPLATE_METADATA.defaultReplyTo,
    subject: MISSED_DEMO_TEMPLATE_METADATA.subject,
    text: buildMissedDemoPlainText(params),
    html: buildMissedDemoHtml(params),
  };
}
