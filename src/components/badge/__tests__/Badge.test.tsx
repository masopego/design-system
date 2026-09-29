import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Badge } from "../Badge";
import { BADGE_VARIANTS } from "../Badge.types";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("uses the neutral variant by default", () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText("New")).toHaveAttribute("data-variant", "neutral");
  });

  it.each(BADGE_VARIANTS)("renders the %s variant", (variant) => {
    render(<Badge variant={variant}>New</Badge>);

    expect(screen.getByText("New")).toHaveAttribute("data-variant", variant);
  });

  it("merges a custom className with its own classes", () => {
    render(<Badge className="custom">New</Badge>);

    const badge = screen.getByText("New");
    expect(badge).toHaveClass("custom");
    expect(badge.classList.length).toBeGreaterThan(1);
  });

  it("forwards native attributes", () => {
    render(
      <Badge id="badge" aria-label="3 unread messages">
        3
      </Badge>,
    );

    expect(screen.getByLabelText("3 unread messages")).toHaveAttribute("id", "badge");
  });

  it("forwards the ref to the underlying span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>New</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("is not interactive nor focusable", () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText("New");
    expect(badge).not.toHaveAttribute("role");
    expect(badge).not.toHaveAttribute("tabindex");
  });
});
