import sendEmail from "../utils/sendEmail";

export const sendMailService = async (
  to: string,
  subject: string,
  html: string
) => {
  await sendEmail({
    to,
    subject,
    html,
  });
};