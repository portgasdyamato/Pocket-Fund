import nodemailer from "nodemailer";

// Simple email service using nodemailer.
// In a real application, you'd use a transactional email provider like SendGrid, Mailgun, etc.
// For now, we use a basic transport. Users will need to set their own credentials in .env.

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or 'host' for custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // e.g., "your-email@gmail.com"
    pass: process.env.EMAIL_PASS, // e.g., "your-app-specific-password"
  },
});

/**
 * Sends a 2FA code to a user's email.
 */
export async function sendOTP(email: string, code: string, userName?: string) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("[EmailService] EMAIL_USER or EMAIL_PASS not set. Logging OTP to console instead.");
      console.log(`\n---------------------------------`);
      console.log(`SECURITY CODE FOR ${email}: ${code}`);
      console.log(`---------------------------------\n`);
      return { success: true, mocked: true };
    }

    const info = await transporter.sendMail({
      from: `"The Vault Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Vault Security Code",
      text: `Hello ${userName || 'there'},\n\nYour one-time security code for withdrawal is: ${code}\n\nThis code will expire in 10 minutes.\n\nStay secure,\nThe Vault Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #111; border-radius: 10px; background-color: #050505; color: white;">
          <h2 style="color: #8b5cf6; text-transform: uppercase; letter-spacing: 2px;">Vault Security</h2>
          <p style="font-size: 16px; opacity: 0.8;">Hello ${userName || 'there'},</p>
          <p style="font-size: 16px; opacity: 0.8;">You requested a withdrawal from your vault. Use the code below to authorize the transaction:</p>
          <div style="background-color: #111; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #8b5cf6;">${code}</span>
          </div>
          <p style="font-size: 12px; opacity: 0.5;">If you did not request this, please secure your account immediately.</p>
        </div>
      `,
    });

    console.log("[EmailService] Message sent: %s", info.messageId);
    return { success: true, mocked: false };
  } catch (error) {
    console.error("[EmailService] Error sending email:", error);
    throw new Error("Failed to send security code.");
  }
}
