import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const [
      totalPropertiesRes,
      availablePropertiesRes,
      totalContactsRes,
      hotLeadsRes,
      activeDealsRes,
      closedDealsRes,
      totalRevenueRes,
      pendingInvoicesRes,
    ] = await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "Available"),
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }).eq("lead_score", "Hot"),
      supabase
        .from("deals")
        .select("*", { count: "exact", head: true })
        .not("pipeline_stage", "in", '("Closed Won","Closed Lost")'),
      supabase.from("deals").select("*", { count: "exact", head: true }).eq("pipeline_stage", "Closed Won"),
      supabase.from("invoices").select("total_amount").eq("status", "Paid"),
      supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .in("status", ["Sent", "Overdue"]),
    ]);

    const totalRevenue = (totalRevenueRes.data ?? []).reduce(
      (sum: number, row: { total_amount: number }) => sum + (row.total_amount ?? 0),
      0
    );

    return Response.json({
      totalProperties: totalPropertiesRes.count ?? 0,
      availableProperties: availablePropertiesRes.count ?? 0,
      totalContacts: totalContactsRes.count ?? 0,
      hotLeads: hotLeadsRes.count ?? 0,
      activeDeals: activeDealsRes.count ?? 0,
      closedDeals: closedDealsRes.count ?? 0,
      totalRevenue,
      pendingInvoices: pendingInvoicesRes.count ?? 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
