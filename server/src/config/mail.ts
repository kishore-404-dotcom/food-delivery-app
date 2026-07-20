import nodemailer from "nodemailer";

import {
  EMAIL_USER,
  EMAIL_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
} from "./env";

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;