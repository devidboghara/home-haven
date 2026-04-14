// Email template functions returning inline-styled HTML strings
// Uses #6366F1 as accent colour with HomeHaven branding

export interface InvoiceEmailData {
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  contactName: string;
}

export interface ContractSignatureEmailData {
  contractTitle: string;
  contactName: string;
  signUrl: string;
}

export interface LeadWelcomeEmailData {
  contactName: string;
  agentName: string;
}

export interface AppointmentReminderEmailData {
  contactName: string;
  date: string;
  location: string;
}

export interface WeeklyReportEmailData {
  agentName: string;
  dealsCount: number;
  revenue: number;
}

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E8E6E0;">
        <!-- Header -->
        <tr>
          <td style="background:#6366F1;padding:24px 32px;">
            <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">HomeHaven</span>
            <span style="color:#c7d2fe;font-size:14px;margin-left:8px;">Real Estate</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F4F5F7;padding:20px 32px;border-top:1px solid #E8E6E0;">
            <p style="margin:0;color:#7C7870;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} HomeHaven Real Estate. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export function invoiceEmail(data: InvoiceEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;color:#111;font-size:20px;font-weight:700;">Invoice ${data.invoiceNumber}</h2>
    <p style="margin:0 0 24px;color:#7C7870;font-size:14px;">Hi ${data.contactName}, please find your invoice details below.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;border-radius:8px;padding:20px;margin-bottom:24px;">
      <tr>
        <td style="color:#7C7870;font-size:13px;padding-bottom:8px;">Invoice Number</td>
        <td style="color:#111;font-size:13px;font-weight:600;text-align:right;padding-bottom:8px;">${data.invoiceNumber}</td>
      </tr>
      <tr>
        <td style="color:#7C7870;font-size:13px;padding-bottom:8px;">Amount Due</td>
        <td style="color:#6366F1;font-size:18px;font-weight:700;text-align:right;padding-bottom:8px;">$${data.amount.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="color:#7C7870;font-size:13px;">Due Date</td>
        <td style="color:#111;font-size:13px;font-weight:600;text-align:right;">${data.dueDate}</td>
      </tr>
    </table>
    <p style="margin:0;color:#7C7870;font-size:13px;">If you have any questions, please reply to this email.</p>`;
  return baseLayout(content);
}

export function contractSignatureEmail(data: ContractSignatureEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;color:#111;font-size:20px;font-weight:700;">Signature Required</h2>
    <p style="margin:0 0 16px;color:#7C7870;font-size:14px;">Hi ${data.contactName}, your signature is required for the following contract:</p>
    <p style="margin:0 0 24px;color:#111;font-size:16px;font-weight:600;">${data.contractTitle}</p>
    <a href="${data.signUrl}" style="display:inline-block;background:#6366F1;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">Sign Contract</a>
    <p style="margin:24px 0 0;color:#7C7870;font-size:12px;">This link will expire in 7 days. If you did not expect this email, please ignore it.</p>`;
  return baseLayout(content);
}

export function leadWelcomeEmail(data: LeadWelcomeEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;color:#111;font-size:20px;font-weight:700;">Welcome to HomeHaven!</h2>
    <p style="margin:0 0 16px;color:#7C7870;font-size:14px;">Hi ${data.contactName}, we're excited to help you find your perfect property.</p>
    <p style="margin:0 0 24px;color:#111;font-size:14px;">Your dedicated agent <strong>${data.agentName}</strong> will be in touch shortly to discuss your requirements and get started on your property search.</p>
    <div style="background:#EEF2FF;border-left:4px solid #6366F1;padding:16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <p style="margin:0;color:#4338CA;font-size:13px;font-weight:600;">What happens next?</p>
      <p style="margin:8px 0 0;color:#6366F1;font-size:13px;">We'll schedule a consultation to understand your needs and match you with the best available properties.</p>
    </div>
    <p style="margin:0;color:#7C7870;font-size:13px;">Feel free to reply to this email with any questions.</p>`;
  return baseLayout(content);
}

export function appointmentReminderEmail(data: AppointmentReminderEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;color:#111;font-size:20px;font-weight:700;">Appointment Reminder</h2>
    <p style="margin:0 0 24px;color:#7C7870;font-size:14px;">Hi ${data.contactName}, this is a reminder about your upcoming appointment.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;border-radius:8px;padding:20px;margin-bottom:24px;">
      <tr>
        <td style="color:#7C7870;font-size:13px;padding-bottom:8px;">Date &amp; Time</td>
        <td style="color:#111;font-size:13px;font-weight:600;text-align:right;padding-bottom:8px;">${data.date}</td>
      </tr>
      <tr>
        <td style="color:#7C7870;font-size:13px;">Location</td>
        <td style="color:#111;font-size:13px;font-weight:600;text-align:right;">${data.location}</td>
      </tr>
    </table>
    <p style="margin:0;color:#7C7870;font-size:13px;">If you need to reschedule, please reply to this email as soon as possible.</p>`;
  return baseLayout(content);
}

export function weeklyReportEmail(data: WeeklyReportEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;color:#111;font-size:20px;font-weight:700;">Weekly Performance Report</h2>
    <p style="margin:0 0 24px;color:#7C7870;font-size:14px;">Hi ${data.agentName}, here's your performance summary for this week.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:0 8px 16px 0;" width="50%">
          <div style="background:#EEF2FF;border-radius:8px;padding:20px;text-align:center;">
            <p style="margin:0 0 4px;color:#7C7870;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Deals Closed</p>
            <p style="margin:0;color:#6366F1;font-size:28px;font-weight:700;">${data.dealsCount}</p>
          </div>
        </td>
        <td style="padding:0 0 16px 8px;" width="50%">
          <div style="background:#F0FDF4;border-radius:8px;padding:20px;text-align:center;">
            <p style="margin:0 0 4px;color:#7C7870;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Revenue</p>
            <p style="margin:0;color:#16A34A;font-size:28px;font-weight:700;">$${data.revenue.toLocaleString()}</p>
          </div>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#7C7870;font-size:13px;">Keep up the great work! Your next report will arrive next Monday.</p>`;
  return baseLayout(content);
}
