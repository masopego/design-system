import styles from "./Tabs.module.scss";
import type { TabPanelProps } from "./Tabs.types";
import { getPanelId, getTabId, useTabsContext } from "./TabsContext";

export function TabPanel({ value, className, children, ...rest }: TabPanelProps) {
  const { baseId, selectedValue } = useTabsContext("TabPanel");
  const isSelected = value === selectedValue;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={getPanelId(baseId, value)}
      aria-labelledby={getTabId(baseId, value)}
      tabIndex={0}
      hidden={!isSelected}
      className={[styles.panel, className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
