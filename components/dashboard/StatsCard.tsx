import { Card } from "@/components/ui/Card";

type StatsCardProps = {
  label: string;
  value: string;
};

export function StatsCard({ label, value }: StatsCardProps) {
  return (
    <Card>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </Card>
  );
}
