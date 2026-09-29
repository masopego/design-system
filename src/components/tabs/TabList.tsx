import type { KeyboardEvent } from "react";
import styles from "./Tabs.module.scss";
import type { TabListProps } from "./Tabs.types";
import { useTabsContext } from "./TabsContext";

export function TabList({ className, onKeyDown, children, ...rest }: TabListProps) {
  const { variant, activationMode, select } = useTabsContext("TabList");

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const tabList = event.currentTarget;
    const tabs = Array.from(tabList.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
      (tab) => tab.closest('[role="tablist"]') === tabList,
    );
    const currentIndex = tabs.indexOf(event.target as HTMLElement);
    if (currentIndex === -1) return;

    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    nextTab.focus();

    const nextValue = nextTab.dataset.value;
    if (activationMode === "automatic" && nextValue !== undefined) {
      select(nextValue);
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={[styles.tabList, styles[variant], className].filter(Boolean).join(" ")}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}
