import transporter from "../config/mail";

import {
  BREVO_API_KEY,
  EMAIL_FROM,
  EMAIL_USER,
} from "../config/env";

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

const parseSender = (from: string): { email: string; name?: string } => {
  const match = from.match(/^\s*([^<]+?)\s*<([^>]+)>\s*$/);
  if (!match) return { email: from };

  return { name: match[1].trim(), email: match[2].trim() };
};

const sendEmailWithBrevo = async ({
  to,
  subject,
  html,
}: SendEmailProps): Promise<void> => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: parseSender(EMAIL_FROM),
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email provider rejected the request (${response.status})`);
  }
};

const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailProps) => {
  if (BREVO_API_KEY) {
    await sendEmailWithBrevo({ to, subject, html });
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM || EMAIL_USER,
    to,
    subject,
    html,
  });
};

export default sendEmail;
