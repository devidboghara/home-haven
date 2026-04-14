const TYPE_PREFIX: Record<string, string> = {
  appointment_reminder: "[HomeHaven Reminder] ",
  offer_update: "[HomeHaven Offer Update] ",
  otp: "[HomeHaven OTP] ",
};

export async function POST(request: Request) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return Response.json({ error: "SMS service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { to, message, type } = body as {
      to: string;
      message: string;
      type: "appointment_reminder" | "offer_update" | "otp";
    };

    const prefix = TYPE_PREFIX[type] ?? "";
    const fullMessage = `${prefix}${message}`;

    const params = new URLSearchParams();
    params.append("From", fromNumber);
    params.append("To", to);
    params.append("Body", fullMessage);

    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return Response.json({ error: err?.message ?? "Twilio error" }, { status: 500 });
    }

    const result = await res.json();
    return Response.json({ sid: result.sid });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
