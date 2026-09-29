import type { ComponentProps } from "react";

export const BADGE_VARIANTS = ["neutral", "positive", "negative"] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
}
