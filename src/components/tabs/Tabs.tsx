import { useCallback, useId, useMemo, useState } from "react";
import styles from "./Tabs.module.scss";
import type { TabsProps } from "./Tabs.types";
import { TabsContext } from "./TabsContext";

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = "pill",
  activationMode = "automatic",
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const select = useCallback(
    (nextValue: string) => {
      if (nextValue === selectedValue) return;

      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange, selectedValue],
  );

  const contextValue = useMemo(
    () => ({ baseId, selectedValue, select, variant, activationMode }),
    [baseId, selectedValue, select, variant, activationMode],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={[styles.tabs, className].filter(Boolean).join(" ")} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
