import type { MouseEvent } from "react";
import { Badge } from "../badge";
import styles from "./Tabs.module.scss";
import type { TabProps } from "./Tabs.types";
import { getPanelId, getTabId, useTabsContext } from "./TabsContext";

export function Tab({ value, badge, className, onClick, children, ...rest }: TabProps) {
  const { baseId, selectedValue, select, variant } = useTabsContext("Tab");
  const isSelected = value === selectedValue;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) select(value);
  };

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={getTabId(baseId, value)}
      aria-selected={isSelected}
      aria-controls={getPanelId(baseId, value)}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      className={[styles.tab, styles[variant], className].filter(Boolean).join(" ")}
      onClick={handleClick}
    >
      <span>{children}</span>
      {badge && (
        <>
          {" "}
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </>
      )}
    </button>
  );
}
