import transporter from "../config/mail";

import {
  EMAIL_USER,
} from "../config/env";

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailProps) => {
  await transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject,
    html,
  });
};

export default sendEmail;