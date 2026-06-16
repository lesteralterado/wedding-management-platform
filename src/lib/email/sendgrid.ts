import sgMail from "@sendgrid/mail";
import { z } from "zod";
import { sendInviteEmailSchema } from "@/lib/validators/common";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export type SendInviteEmailInput = z.infer<typeof sendInviteEmailSchema>;

type SendResult = { success: true } | { success: false; error: string };

export async function sendInviteEmail(input: SendInviteEmailInput): Promise<SendResult> {
  const parsed = sendInviteEmailSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid email data." };
  }

  if (!process.env.SENDGRID_API_KEY) {
    return { success: false, error: "SendGrid API key not configured." };
  }

  const { to, guestName, coupleNames, weddingDate, weddingVenue, inviteUrl } = parsed.data;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Wedding Invitation</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8b5cf6; font-size: 28px;">You're Invited!</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; margin-bottom: 16px;">Dear ${guestName},</p>
          <p style="font-size: 16px; margin-bottom: 16px;">
            ${coupleNames} joyfully invite you to celebrate their wedding day!
          </p>
          ${weddingDate ? `<p style="font-size: 16px; margin-bottom: 8px;"><strong>Date:</strong> ${weddingDate}</p>` : ""}
          ${weddingVenue ? `<p style="font-size: 16px; margin-bottom: 16px;"><strong>Venue:</strong> ${weddingVenue}</p>` : ""}
          <div style="text-align: center; margin: 24px 0;">
            <a href="${inviteUrl}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Invitation & RSVP
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            This invitation link is unique to you. Please RSVP by clicking the button above.
          </p>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
          Wedding Management Platform
        </p>
      </body>
    </html>
  `;

  const msg = {
    to,
    from: process.env.INVITE_FROM_EMAIL || "weddings@yourdomain.com",
    subject: `Wedding Invitation from ${coupleNames}`,
    html,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error);
    return { success: false, error: "Failed to send email." };
  }
}

export async function sendBulkInvites(
  invites: SendInviteEmailInput[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  const errors: string[] = [];
  let success = 0;
  let failed = 0;

  for (const invite of invites) {
    const result = await sendInviteEmail(invite);
    if (result.success) {
      success++;
    } else {
      failed++;
      errors.push(`${invite.to}: ${result.error}`);
    }
  }

  return { success, failed, errors };
}