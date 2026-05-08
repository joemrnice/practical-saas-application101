import Link from "next/link";
import { PricingTable } from "@/components/billing/PricingTable";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

const features = [
  {
    title: "AI Generation",
    description: "Create blogs, emails, social posts, and code snippets using GPT-4o.",
  },
  {
    title: "Secure Auth",
    description: "Supabase Auth with email/password, OAuth, and server-side session checks.",
  },
  {
    title: "Subscription Plans",
    description: "Scale from free to enterprise with Stripe-powered billing.",
  },
];

const steps = [
  "Sign up for a free account and verify your email.",
  "Enter a prompt and choose a content type.",
  "Generate, save, and manage outputs in your dashboard.",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Build Better Content with AI</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
            Practical AI SaaS helps teams generate high-quality content quickly with secure auth and subscription billing.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button className="px-6 py-3 text-base">Get Started Free</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-semibold">Features</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-zinc-200 p-5">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-semibold">How It Works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-lg border border-zinc-200 p-5">
                <p className="text-sm font-semibold text-zinc-500">Step {index + 1}</p>
                <p className="mt-2">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-semibold">Pricing</h2>
          <PricingTable currentPlan="free" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
