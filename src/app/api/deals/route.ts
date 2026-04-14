import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("deals")
      .select("*, properties(address, city), contacts(full_name, email)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return Response.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, pipeline_stage } = await request.json();
    const { data, error } = await supabase
      .from("deals")
      .update({ pipeline_stage })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
