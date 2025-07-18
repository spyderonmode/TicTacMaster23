import * as nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private transporter: any;
  private fromEmail: string;

  constructor(config: EmailConfig, fromEmail: string) {
    this.fromEmail = fromEmail;
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
      };

      console.log('📧 Sending email:', {
        to: params.to,
        subject: params.subject,
        from: this.fromEmail
      });

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', params.to);
      return true;
    } catch (error) {
      console.error('❌ SMTP email error:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `https://tic-tac-master-zanv1.replit.app/verify-email?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Verify Your Email - TicTac 3x5</h2>
        <p>Thanks for signing up for TicTac 3x5! Please verify your email address to secure your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `;

    return await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - TicTac 3x5',
      html,
      text: `Please verify your email by clicking this link: ${verificationUrl}`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `https://tic-tac-master-zanv1.replit.app/reset-password?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset - TicTac 3x5</h2>
        <p>You requested a password reset for your TicTac 3x5 account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `;

    return await this.sendEmail({
      to: email,
      subject: 'Password Reset - TicTac 3x5',
      html,
      text: `Reset your password by clicking this link: ${resetUrl}`,
    });
  }
}

// Create email service instance if SMTP settings are provided
export function createEmailService(): EmailService | null {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
    console.log('SMTP configuration not complete - email verification disabled');
    console.log('Missing:', {
      smtpHost: !!smtpHost,
      smtpPort: !!smtpPort,
      smtpUser: !!smtpUser,
      smtpPass: !!smtpPass,
      fromEmail: !!fromEmail
    });
    return null;
  }

  console.log('✅ SMTP configuration complete - email service enabled');
  console.log('SMTP settings:', {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    from: fromEmail
  });

  const config: EmailConfig = {
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  };

  return new EmailService(config, fromEmail);
}