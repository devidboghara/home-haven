import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const deal_type = searchParams.get("deal_type");
    const city = searchParams.get("city");

    let query = supabase.from("properties").select("*").order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (deal_type) query = query.eq("deal_type", deal_type);
    if (city) query = query.eq("city", city);

    const { data, error } = await query;
    if (error) throw error;
    return Response.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from("properties").insert(body).select().single();
    if (error) throw error;
    return Response.json({ data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
