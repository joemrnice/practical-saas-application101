"use client";

import { useEffect, useState } from "react";
import { OutputCard } from "@/components/generate/OutputCard";
import { PromptForm } from "@/components/generate/PromptForm";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { useGeneration } from "@/hooks/useGeneration";
import { useUser } from "@/hooks/useUser";
import type { ContentType } from "@/types";

type UsageState = {
  used: number;
  plan: "free" | "pro" | "enterprise";
};

export default function GeneratePage() {
  const { user } = useUser();
  const { output, loading, error, generate } = useGeneration();
  const { pushToast } = useToast();
  const [usage, setUsage] = useState<UsageState>({ used: 0, plan: "free" });

  const refreshUsage = async () => {
    if (!user) return;

    const supabase = createClient();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const [{ count }, { data: subscription }] = await Promise.all([
      supabase
        .from("generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", start.toISOString()),
      supabase.from("subscriptions").select("plan").eq("user_id", user.id).maybeSingle(),
    ]);

    setUsage({
      used: count ?? 0,
      plan: (subscription?.plan ?? "free") as UsageState["plan"],
    });
  };

  useEffect(() => {
    void Promise.resolve().then(refreshUsage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (error) pushToast(error, "error");
  }, [error, pushToast]);

  const handleGenerate = async (prompt: string, type: ContentType) => {
    pushToast("Generating content...", "info");
    await generate(prompt, type);
    await refreshUsage();
    pushToast("Generation completed", "success");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Generate AI Content</h1>
        {usage.plan === "free" ? (
          <p className="text-sm text-zinc-600">Usage today: {usage.used} / 10 daily generations used</p>
        ) : (
          <p className="text-sm text-zinc-600">Unlimited generations on {usage.plan} plan.</p>
        )}
        <PromptForm onSubmit={handleGenerate} loading={loading} />
      </div>
      <OutputCard
        output={output}
        loading={loading}
        onSave={() => pushToast("Output is auto-saved after generation", "success")}
      />
    </div>
  );
}
