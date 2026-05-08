"use client";

import { useEffect, useState } from "react";
import { PricingTable } from "@/components/billing/PricingTable";
import { SubscriptionBadge } from "@/components/billing/SubscriptionBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { normalizePlan, type PlanKey } from "@/lib/stripe";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";

export default function SettingsPage() {
  const supabase = createClient();
  const { user } = useUser();
  const { subscription } = useSubscription(user?.id);
  const { pushToast } = useToast();
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setFullName(data?.full_name ?? ""));
  }, [supabase, user]);

  const updateProfile = async () => {
    if (!user) return;

    let avatarUrl: string | undefined;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop() ?? "png";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, {
        upsert: true,
      });
      if (error) {
        pushToast(error.message, "error");
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, avatar_url: avatarUrl })
      .eq("id", user.id);

    if (error) {
      pushToast(error.message, "error");
      return;
    }

    pushToast("Profile updated", "success");
  };

  const cancelSubscription = async () => {
    const response = await fetch("/api/stripe/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true }),
    });

    if (!response.ok) {
      pushToast("Failed to cancel subscription", "error");
      return;
    }

    pushToast("Subscription will cancel at period end", "success");
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete your account permanently?")) return;

    const response = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true }),
    });

    if (!response.ok) {
      pushToast("Failed to delete account", "error");
      return;
    }

    pushToast("Account deleted", "success");
    window.location.href = "/";
  };

  const plan = normalizePlan(subscription?.plan);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Profile</h2>
        <div className="grid gap-3 md:max-w-lg">
          <Input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full name"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
          />
          <Button onClick={updateProfile}>Update Profile</Button>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Subscription</h2>
        <div className="mb-4 flex items-center gap-2">
          <span>Current Plan:</span>
          <SubscriptionBadge plan={plan} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setPricingOpen(true)}>Upgrade</Button>
          {plan !== "free" ? (
            <Button variant="outline" onClick={cancelSubscription}>
              Cancel Subscription
            </Button>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h2 className="mb-3 text-lg font-semibold text-red-700">Danger Zone</h2>
        <Button variant="danger" onClick={deleteAccount}>
          Delete Account
        </Button>
      </section>

      <Modal open={pricingOpen} onClose={() => setPricingOpen(false)} title="Choose Plan">
        <PricingTable currentPlan={plan as PlanKey} />
      </Modal>
    </div>
  );
}
