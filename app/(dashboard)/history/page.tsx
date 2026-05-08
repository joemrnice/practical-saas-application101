"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatDate, truncate } from "@/lib/utils";
import type { ContentType, Generation } from "@/types";

type HistoryResponse = {
  data: Generation[];
  count: number;
  page: number;
  pageSize: number;
};

export default function HistoryPage() {
  const [items, setItems] = useState<Generation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [type, setType] = useState<"" | ContentType>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const { pushToast } = useToast();

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  const load = async () => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (type) params.set("type", type);
    if (from) params.set("from", new Date(from).toISOString());
    if (to) params.set("to", new Date(to).toISOString());

    const response = await fetch(`/api/history?${params.toString()}`);
    const body = (await response.json()) as HistoryResponse & { error?: string };

    if (!response.ok) {
      pushToast(body.error ?? "Failed to load history", "error");
      return;
    }

    setItems(body.data);
    setTotal(body.count);
  };

  useEffect(() => {
    void Promise.resolve().then(load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type, from, to]);

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this generation?")) return;

    const response = await fetch("/api/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      pushToast("Failed to delete generation", "error");
      return;
    }

    pushToast("Generation deleted", "success");
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Generation History</h1>

      <div className="grid gap-2 md:grid-cols-4">
        <Input
          value={type}
          onChange={(event) => setType(event.target.value as "" | ContentType)}
          placeholder="Type (blog/email/social/code)"
        />
        <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        <Button variant="outline" onClick={() => setPage(1)}>
          Apply filters
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-3 py-2">Prompt</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Tokens</th>
              <th className="px-3 py-2">Output</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-zinc-100 align-top">
                <td className="px-3 py-2">{truncate(item.prompt, 60)}</td>
                <td className="px-3 py-2 uppercase">{item.type}</td>
                <td className="px-3 py-2">{formatDate(item.created_at)}</td>
                <td className="px-3 py-2">{item.tokens_used ?? "—"}</td>
                <td className="px-3 py-2">
                  {expandedId === item.id ? item.output : truncate(item.output, 60)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      {expandedId === item.id ? "Collapse" : "Expand"}
                    </Button>
                    <Button variant="danger" onClick={() => deleteItem(item.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <p className="text-sm text-zinc-600">
          Page {page} of {totalPages}
        </p>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
