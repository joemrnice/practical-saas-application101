import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient, normalizePlan } from "@/lib/stripe";

function extractPlanFromSubscription(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id;
  if (priceId && priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    return "enterprise";
  }
  if (priceId && priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return "pro";
  }
  return "free";
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  const stripe = getStripeClient();

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const plan = normalizePlan(session.metadata?.plan);

    if (userId) {
      await supabase
        .from("subscriptions")
        .update({
          plan,
          status: "active",
          stripe_customer_id:
            typeof session.customer === "string" ? session.customer : null,
          stripe_subscription_id:
            typeof session.subscription === "string" ? session.subscription : null,
        })
        .eq("user_id", userId);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const plan = extractPlanFromSubscription(subscription);
    const currentPeriodEnd =
      "current_period_end" in subscription &&
      typeof subscription.current_period_end === "number"
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

    await supabase
      .from("subscriptions")
      .update({
        plan,
        status:
          subscription.status === "past_due"
            ? "past_due"
            : subscription.status === "canceled"
              ? "canceled"
              : "active",
        stripe_customer_id:
          typeof subscription.customer === "string" ? subscription.customer : null,
        stripe_subscription_id: subscription.id,
        current_period_end: currentPeriodEnd,
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabase
      .from("subscriptions")
      .update({
        plan: "free",
        status: "canceled",
        stripe_subscription_id: null,
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
