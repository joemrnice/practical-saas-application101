import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt, getOpenAIClient, MODEL_NAME } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  prompt: z.string().trim().min(1).max(4000),
  type: z.enum(["blog", "email", "social", "code"]),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .maybeSingle();

  const isFree = !subscription || subscription.plan === "free";

  if (isFree) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", start.toISOString());

    if ((count ?? 0) >= 10) {
      return NextResponse.json(
        { error: "Daily free plan limit reached (10 generations/day)." },
        { status: 429 }
      );
    }
  }

  const openai = getOpenAIClient();
  let completion;

  try {
    completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      stream: true,
      stream_options: { include_usage: true },
      messages: [
        { role: "system", content: buildSystemPrompt(parsed.data.type) },
        { role: "user", content: parsed.data.prompt },
      ],
    });
  } catch {
    completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(parsed.data.type) },
        { role: "user", content: parsed.data.prompt },
      ],
    });
  }

  let output = "";
  let tokensUsed: number | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content ?? "";
          if (token) {
            output += token;
            controller.enqueue(encoder.encode(token));
          }

          if (chunk.usage?.total_tokens) {
            tokensUsed = chunk.usage.total_tokens;
          }
        }

        if (output) {
          await supabase.from("generations").insert({
            user_id: user.id,
            prompt: parsed.data.prompt,
            output,
            type: parsed.data.type,
            model: MODEL_NAME,
            tokens_used: tokensUsed,
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Generation failed";
        controller.error(new Error(message));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
