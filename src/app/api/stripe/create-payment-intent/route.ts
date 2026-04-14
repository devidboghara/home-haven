export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ error: "Payment service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { amount, currency = "usd", metadata = {} } = body as {
      amount: number;
      currency?: string;
      metadata?: Record<string, string>;
    };

    // Build URLSearchParams body for Stripe API
    const params = new URLSearchParams();
    params.append("amount", String(Math.round(amount)));
    params.append("currency", currency);
    for (const [key, value] of Object.entries(metadata)) {
      params.append(`metadata[${key}]`, String(value));
    }

    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.json();
      return Response.json({ error: err?.error?.message ?? "Stripe error" }, { status: 500 });
    }

    const intent = await res.json();
    return Response.json({ clientSecret: intent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
