import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// send email using Resend
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');
  return resend.emails.send({
    from: process.env.RESEND_FROM || 'noreply@yourdomain.com',
    to,
    subject,
    html,
  });
} 