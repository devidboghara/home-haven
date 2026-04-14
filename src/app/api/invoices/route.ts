import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, invoice_line_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return Response.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { invoice, lineItems } = await request.json();

    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .insert(invoice)
      .select()
      .single();
    if (invoiceError) throw invoiceError;

    if (lineItems && lineItems.length > 0) {
      const itemsWithId = lineItems.map((item: Record<string, unknown>) => ({
        ...item,
        invoice_id: invoiceData.id,
      }));
      const { error: lineItemsError } = await supabase
        .from("invoice_line_items")
        .insert(itemsWithId);
      if (lineItemsError) throw lineItemsError;
    }

    return Response.json({ data: invoiceData }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
