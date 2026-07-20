export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  sendEmail(
    options: EmailOptions
  ): Promise<void>;
}