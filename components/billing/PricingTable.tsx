"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PLANS, type PlanKey } from "@/lib/stripe";
import { useToast } from "@/components/ui/Toast";

type PricingTableProps = {
  currentPlan?: PlanKey;
};

export function PricingTable({ currentPlan = "free" }: PricingTableProps) {
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const { pushToast } = useToast();

  const checkout = async (plan: PlanKey) => {
    if (plan === "free") return;
    setLoadingPlan(plan);
    pushToast("Creating checkout session...", "info");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const body = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !body.url) throw new Error(body.error ?? "Checkout failed");

      window.location.assign(body.url);
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Checkout failed", "error");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(Object.keys(PLANS) as PlanKey[]).map((planKey) => {
        const plan = PLANS[planKey];
        const isCurrent = currentPlan === planKey;

        return (
          <Card key={plan.key} className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-3xl font-bold">
                ${plan.priceMonthly}
                <span className="text-sm font-normal text-zinc-500">/mo</span>
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-600">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
            <Button
              className="mt-6"
              variant={isCurrent ? "outline" : "primary"}
              disabled={isCurrent || loadingPlan === planKey}
              onClick={() => checkout(planKey)}
            >
              {isCurrent ? "Current Plan" : loadingPlan === planKey ? "Loading..." : "Choose Plan"}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
