import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 400 });
  }

  const rawBody = await request.text();
  const sigHeader = request.headers.get("stripe-signature") ?? "";

  // Parse t= and v1= from the stripe-signature header
  const parts = Object.fromEntries(
    sigHeader.split(",").map((part) => {
      const [k, v] = part.split("=");
      return [k.trim(), v?.trim()];
    })
  );

  const t = parts["t"];
  const v1 = parts["v1"];

  if (!t || !v1) {
    return new Response("Webhook signature invalid", { status: 400 });
  }

  // Verify HMAC-SHA256 signature
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${t}.${rawBody}`)
    .digest("hex");

  if (expected !== v1) {
    return new Response("Webhook signature invalid", { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const paymentIntent = event.data.object;
  const paymentIntentId = paymentIntent.id as string;

  if (event.type === "payment_intent.succeeded") {
    await supabase
      .from("payments")
      .update({ status: "Completed" })
      .eq("reference_no", paymentIntentId);
  } else if (event.type === "payment_intent.payment_failed") {
    await supabase
      .from("payments")
      .update({ status: "Failed" })
      .eq("reference_no", paymentIntentId);
  }

  return new Response("OK", { status: 200 });
}
