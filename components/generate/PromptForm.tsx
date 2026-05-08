"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { ContentType } from "@/types";

type PromptFormProps = {
  onSubmit: (prompt: string, type: ContentType) => void;
  loading: boolean;
};

export function PromptForm({ onSubmit, loading }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<ContentType>("blog");

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(prompt, type);
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="content-type">
          Content Type
        </label>
        <select
          id="content-type"
          value={type}
          onChange={(event) => setType(event.target.value as ContentType)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        >
          <option value="blog">Blog</option>
          <option value="email">Email</option>
          <option value="social">Social</option>
          <option value="code">Code</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="prompt-text">
          Prompt
        </label>
        <Textarea
          id="prompt-text"
          required
          rows={5}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Write a topic or ask for content..."
        />
      </div>
      <Button disabled={loading} type="submit">
        {loading ? "Generating..." : "Generate"}
      </Button>
    </form>
  );
}
