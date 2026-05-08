import { RecentHistory } from "@/components/dashboard/RecentHistory";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";

function daysUntil(dateValue: string | null | undefined) {
  if (!dateValue) return null;
  const target = new Date(dateValue).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [profileRes, subRes, totalRes, todayRes, historyRes] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("subscriptions")
      .select("plan,current_period_end")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome, {profileRes.data?.full_name || user.email || "there"}
        </h1>
        <p className="text-sm text-zinc-600">Here&apos;s your content activity overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard label="Total Generations" value={String(totalRes.count ?? 0)} />
        <StatsCard label="Generations Today" value={String(todayRes.count ?? 0)} />
        <StatsCard label="Current Plan" value={subRes.data?.plan ?? "free"} />
        <StatsCard
          label="Days Until Renewal"
          value={String(daysUntil(subRes.data?.current_period_end) ?? "—")}
        />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent History</h2>
        <RecentHistory items={historyRes.data ?? []} />
      </section>
    </div>
  );
}
