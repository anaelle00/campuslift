import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/lib/server-env";

export const resend = serverEnv.RESEND_API_KEY
  ? new Resend(serverEnv.RESEND_API_KEY)
  : null;

type SendSupportNotificationParams = {
  ownerEmail: string;
  ownerName: string;
  projectTitle: string;
  projectId: string;
  amount: number;
};

export async function sendSupportNotification({
  ownerEmail,
  ownerName,
  projectTitle,
  projectId,
  amount,
}: SendSupportNotificationParams) {
  if (!resend) return;

  await resend.emails.send({
    from: "CampusLift <notifications@campuslift.app>",
    to: ownerEmail,
    subject: `Someone supported "${projectTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a2e;">
        <div style="background: linear-gradient(135deg, #7c3aed22, #f5f3ff); border-radius: 16px; padding: 32px;">
          <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">
            You received a new pledge 🎉
          </h1>
          <p style="color: #6b7280; margin: 0 0 24px;">
            Hi ${ownerName}, someone just supported your project on CampusLift.
          </p>

          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">Project</p>
            <p style="margin: 0 0 16px; font-weight: 600;">${projectTitle}</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">Amount pledged</p>
            <p style="margin: 0; font-size: 24px; font-weight: 700; color: #7c3aed;">$${amount}</p>
          </div>

          <a
            href="https://campuslift.vercel.app/projects/${projectId}"
            style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px;"
          >
            View your project
          </a>
        </div>

        <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px;">
          CampusLift — Student micro-funding platform
        </p>
      </div>
    `,
  });
}
