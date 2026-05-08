"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

type OutputCardProps = {
  output: string;
  loading: boolean;
  onSave: () => void;
};

export function OutputCard({ output, loading, onSave }: OutputCardProps) {
  return (
    <Card className="min-h-52">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Output</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(output)}
            disabled={!output}
          >
            Copy
          </Button>
          <Button onClick={onSave} disabled={!output}>
            Save
          </Button>
        </div>
      </div>
      {loading && !output ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Spinner /> Generating content...
        </div>
      ) : (
        <pre className="whitespace-pre-wrap text-sm text-zinc-800">{output || "No output yet."}</pre>
      )}
    </Card>
  );
}
