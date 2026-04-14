import {
  invoiceEmail,
  contractSignatureEmail,
  leadWelcomeEmail,
  appointmentReminderEmail,
  weeklyReportEmail,
} from "@/lib/email-templates";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATE_MAP: Record<string, (data: any) => string> = {
  invoice: (d) => invoiceEmail(d),
  contract_signature: (d) => contractSignatureEmail(d),
  lead_welcome: (d) => leadWelcomeEmail(d),
  appointment_reminder: (d) => appointmentReminderEmail(d),
  weekly_report: (d) => weeklyReportEmail(d),
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Email service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { to, subject, html, template, data } = body as {
      to: string;
      subject?: string;
      html?: string;
      template?: string;
      data?: Record<string, unknown>;
    };

    let emailHtml = html;
    if (template && TEMPLATE_MAP[template] && data) {
      emailHtml = TEMPLATE_MAP[template](data);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HomeHaven <noreply@homehaven.app>",
        to,
        subject: subject ?? "Message from HomeHaven",
        html: emailHtml ?? "<p>No content provided.</p>",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }

    const result = await res.json();
    return Response.json({ id: result.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
