import { Badge } from "@/components/ui/Badge";
import type { PlanKey } from "@/lib/stripe";

export function SubscriptionBadge({ plan }: { plan: PlanKey }) {
  return <Badge className="uppercase">{plan}</Badge>;
}
