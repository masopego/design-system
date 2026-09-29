import type { ComponentProps, ReactNode } from "react";
import type { BadgeVariant } from "../badge";

export const TABS_VARIANTS = ["pill", "underline"] as const;

export type TabsVariant = (typeof TABS_VARIANTS)[number];

export const TABS_ACTIVATION_MODES = ["automatic", "manual"] as const;

export type TabsActivationMode = (typeof TABS_ACTIVATION_MODES)[number];

interface TabsBaseProps extends Omit<ComponentProps<"div">, "defaultValue" | "onChange"> {
  variant?: TabsVariant;
  activationMode?: TabsActivationMode;
  onValueChange?: (value: string) => void;
}

interface ControlledTabsProps extends TabsBaseProps {
  value: string;
  defaultValue?: never;
}

interface UncontrolledTabsProps extends TabsBaseProps {
  defaultValue: string;
  value?: never;
}

export type TabsProps = ControlledTabsProps | UncontrolledTabsProps;

type TabListLabelProps = { "aria-label": string } | { "aria-labelledby": string };

export type TabListProps = ComponentProps<"div"> & TabListLabelProps;

export interface TabBadge {
  label: ReactNode;
  variant?: BadgeVariant;
}

export interface TabProps extends Omit<ComponentProps<"button">, "value" | "type"> {
  value: string;
  badge?: TabBadge;
}

export interface TabPanelProps extends ComponentProps<"div"> {
  value: string;
}

export interface TabsContextValue {
  baseId: string;
  selectedValue: string | undefined;
  select: (value: string) => void;
  variant: TabsVariant;
  activationMode: TabsActivationMode;
}
