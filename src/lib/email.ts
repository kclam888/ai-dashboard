import { gmail } from './google-auth';

function createEmail(to: string, subject: string, html: string) {
  const emailLines = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${to}`,
    'From: AI Dashboard <no-reply@your-domain.com>',
    `Subject: ${subject}`,
    '',
    html
  ];

  const email = emailLines.join('\r\n');
  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`

  try {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google Cloud credentials not configured, skipping email send');
      return null;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #13111A; color: white; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <img src="${process.env.NEXTAUTH_URL}/logo.png" alt="AI Dashboard Logo" style="width: 64px; height: 64px; margin-bottom: 20px;">
              <h1 style="margin: 0 0 20px; font-size: 24px; color: white;">Verify Your Email Address</h1>
              <p style="margin: 0 0 30px; color: #9CA3AF; font-size: 16px;">
                Thanks for signing up! Please click the button below to verify your email address.
              </p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #2D7FF9; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                Verify Email
              </a>
              <p style="margin: 30px 0 0; color: #9CA3AF; font-size: 14px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
              <p style="margin: 20px 0 0; color: #9CA3AF; font-size: 14px;">
                Button not working? Copy and paste this link into your browser:<br>
                <span style="color: #2D7FF9;">${verificationUrl}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const raw = createEmail(email, 'Verify your email address', html);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw }
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return null;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

  try {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google Cloud credentials not configured, skipping email send');
      return null;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #13111A; color: white; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <img src="${process.env.NEXTAUTH_URL}/logo.png" alt="AI Dashboard Logo" style="width: 64px; height: 64px; margin-bottom: 20px;">
              <h1 style="margin: 0 0 20px; font-size: 24px; color: white;">Reset Your Password</h1>
              <p style="margin: 0 0 30px; color: #9CA3AF; font-size: 16px;">
                You requested to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #2D7FF9; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                Reset Password
              </a>
              <p style="margin: 30px 0 0; color: #9CA3AF; font-size: 14px;">
                If you didn't request this, you can safely ignore this email.
              </p>
              <p style="margin: 20px 0 0; color: #9CA3AF; font-size: 14px;">
                Button not working? Copy and paste this link into your browser:<br>
                <span style="color: #2D7FF9;">${resetUrl}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const raw = createEmail(email, 'Reset your password', html);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw }
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return null;
  }
} 