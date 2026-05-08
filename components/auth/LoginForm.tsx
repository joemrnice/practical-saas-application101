"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export function LoginForm() {
  const supabase = createClient();
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  };

  return (
    <form
      className="mx-auto grid w-full max-w-md gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        pushToast("Signing in...", "info");

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          pushToast(error.message, "error");
          setLoading(false);
          return;
        }

        pushToast("Signed in successfully", "success");
        window.location.href = "/dashboard";
      }}
    >
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <Input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button disabled={loading} type="submit">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <Button variant="outline" type="button" onClick={signInWithGoogle}>
        Continue with Google
      </Button>
      <p className="text-sm text-zinc-600">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </form>
  );
}
