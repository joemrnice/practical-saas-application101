"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate, truncate } from "@/lib/utils";
import type { Generation } from "@/types";

type RecentHistoryProps = {
  items: Generation[];
};

export function RecentHistory({ items }: RecentHistoryProps) {
  if (!items.length) {
    return <Card>No generations yet.</Card>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <Card key={item.id}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{truncate(item.prompt, 80)}</p>
              <p className="text-xs text-zinc-500">{formatDate(item.created_at)}</p>
              <p className="mt-2 text-sm text-zinc-700">{truncate(item.output, 140)}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(item.output)}
            >
              Copy
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
