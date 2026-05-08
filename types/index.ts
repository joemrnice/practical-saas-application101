import { Tables } from "@/types/database.types";

export type ContentType = "blog" | "email" | "social" | "code";

export type Generation = Tables<"generations">;
export type Profile = Tables<"profiles">;
export type Subscription = Tables<"subscriptions">;

export type GenerationStats = {
  total: number;
  today: number;
  daysUntilRenewal: number | null;
};
