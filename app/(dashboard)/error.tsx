"use client";

import { Button } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      <p className="font-semibold">Something went wrong in the dashboard.</p>
      <p className="mt-2 text-sm">{error.message}</p>
      <Button className="mt-3" variant="outline" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
