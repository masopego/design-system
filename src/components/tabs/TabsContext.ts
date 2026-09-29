import { createContext, useContext } from "react";
import type { TabsContextValue } from "./Tabs.types";

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(componentName: string): TabsContextValue {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`<${componentName}> must be used within <Tabs>.`);
  }

  return context;
}

const toIdSegment = (value: string) => value.trim().replace(/\s+/g, "-");

export const getTabId = (baseId: string, value: string) => `${baseId}-tab-${toIdSegment(value)}`;

export const getPanelId = (baseId: string, value: string) =>
  `${baseId}-panel-${toIdSegment(value)}`;
