import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient, PLANS, type PlanKey } from "@/lib/stripe";

const bodySchema = z.object({
  plan: z.enum(["pro", "enterprise"]),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const planKey = parsed.data.plan as PlanKey;
  const plan = PLANS[planKey];

  if (!plan.stripePriceId) {
    return NextResponse.json({ error: "Missing Stripe price id" }, { status: 500 });
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?checkout=canceled`,
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      plan: planKey,
    },
  });

  return NextResponse.json({ url: session.url });
}
