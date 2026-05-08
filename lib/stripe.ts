import Stripe from "stripe";

export function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
}

export type PlanKey = "free" | "pro" | "enterprise";

export const PLANS = {
  free: {
    key: "free",
    name: "Free",
    priceMonthly: 0,
    generationsPerDay: 10,
    stripePriceId: "",
    features: ["10 generations/day", "Standard model", "Community support"],
  },
  pro: {
    key: "pro",
    name: "Pro",
    priceMonthly: 19,
    generationsPerDay: null,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    features: ["Unlimited generations", "Priority model", "Email support"],
  },
  enterprise: {
    key: "enterprise",
    name: "Enterprise",
    priceMonthly: 49,
    generationsPerDay: null,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "",
    features: ["Everything in Pro", "API access badge", "Priority support"],
  },
} as const;

export function normalizePlan(value: string | null | undefined): PlanKey {
  if (value === "pro" || value === "enterprise") return value;
  return "free";
}
