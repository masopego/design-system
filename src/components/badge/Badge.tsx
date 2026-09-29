import styles from "./Badge.module.scss";
import type { BadgeProps } from "./Badge.types";

export function Badge({ variant = "neutral", className, children, ...rest }: BadgeProps) {
  const classes = [styles.badge, styles[variant], className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-variant={variant} {...rest}>
      {children}
    </span>
  );
}
