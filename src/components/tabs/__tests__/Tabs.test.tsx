import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";
import { Tab } from "../Tab";
import { TabList } from "../TabList";
import { TabPanel } from "../TabPanel";
import { Tabs } from "../Tabs";
import type { TabsProps } from "../Tabs.types";

function renderTabs(props: Partial<TabsProps> = {}) {
  const tabsProps = { defaultValue: "inbox", ...props } as TabsProps;

  return render(
    <Tabs {...tabsProps}>
      <TabList aria-label="Messages">
        <Tab value="inbox" badge={{ label: "3", variant: "negative" }}>
          Inbox
        </Tab>
        <Tab value="sent">Sent</Tab>
        <Tab value="archived">Archived</Tab>
      </TabList>
      <TabPanel value="inbox">Inbox content</TabPanel>
      <TabPanel value="sent">Sent content</TabPanel>
      <TabPanel value="archived">Archived content</TabPanel>
    </Tabs>,
  );
}

const getTab = (name: string | RegExp) => screen.getByRole("tab", { name });

describe("Tabs", () => {
  describe("semantics", () => {
    it("renders a labelled tablist with its tabs", () => {
      renderTabs();

      expect(screen.getByRole("tablist", { name: "Messages" })).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(3);
    });

    it("selects the tab given by defaultValue and shows only its panel", () => {
      renderTabs({ defaultValue: "sent" });

      expect(getTab("Sent")).toHaveAttribute("aria-selected", "true");
      expect(getTab(/Inbox/)).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Sent content");
      expect(screen.getByText("Inbox content")).not.toBeVisible();
    });

    it("links each tab with its panel", () => {
      renderTabs();

      const tab = getTab(/Inbox/);
      const panel = screen.getByRole("tabpanel");

      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
      expect(panel).toHaveAccessibleName("Inbox 3");
    });

    it("uses a roving tabindex", () => {
      renderTabs();

      expect(getTab(/Inbox/)).toHaveAttribute("tabindex", "0");
      expect(getTab("Sent")).toHaveAttribute("tabindex", "-1");
      expect(getTab("Archived")).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("badge", () => {
    it("renders the badge inside the tab as part of its accessible name", () => {
      renderTabs();

      const tab = getTab("Inbox 3");
      expect(tab).toContainElement(screen.getByText("3"));
      expect(screen.getByText("3")).toHaveAttribute("data-variant", "negative");
    });
  });

  describe("mouse interaction", () => {
    it("selects a tab on click", async () => {
      const user = userEvent.setup();
      renderTabs();

      await user.click(getTab("Archived"));

      expect(getTab("Archived")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Archived content");
    });
  });

  describe("keyboard interaction", () => {
    it("moves focus into the selected tab and then to its panel with Tab", async () => {
      const user = userEvent.setup();
      renderTabs({ defaultValue: "sent" });

      await user.tab();
      expect(getTab("Sent")).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("tabpanel")).toHaveFocus();
    });

    it("selects the next and previous tabs with the arrow keys, wrapping around", async () => {
      const user = userEvent.setup();
      renderTabs();

      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(getTab("Sent")).toHaveFocus();
      expect(getTab("Sent")).toHaveAttribute("aria-selected", "true");

      await user.keyboard("{ArrowLeft}{ArrowLeft}");
      expect(getTab("Archived")).toHaveFocus();
      expect(getTab("Archived")).toHaveAttribute("aria-selected", "true");

      await user.keyboard("{ArrowRight}");
      expect(getTab(/Inbox/)).toHaveFocus();
    });

    it("moves to the first and last tabs with Home and End", async () => {
      const user = userEvent.setup();
      renderTabs();

      await user.tab();
      await user.keyboard("{End}");
      expect(getTab("Archived")).toHaveFocus();

      await user.keyboard("{Home}");
      expect(getTab(/Inbox/)).toHaveFocus();
    });

    it("only moves focus with the arrow keys in manual activation mode", async () => {
      const user = userEvent.setup();
      renderTabs({ activationMode: "manual" });

      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(getTab("Sent")).toHaveFocus();
      expect(getTab("Sent")).toHaveAttribute("aria-selected", "false");

      await user.keyboard("{Enter}");
      expect(getTab("Sent")).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("controlled mode", () => {
    it("notifies changes and lets the parent own the state", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Tabs value="inbox" onValueChange={onValueChange}>
          <TabList aria-label="Messages">
            <Tab value="inbox">Inbox</Tab>
            <Tab value="sent">Sent</Tab>
          </TabList>
        </Tabs>,
      );

      await user.click(getTab("Sent"));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith("sent");
      expect(getTab("Inbox")).toHaveAttribute("aria-selected", "true");
    });

    it("reflects the value provided by the parent", async () => {
      const user = userEvent.setup();

      function ControlledTabs() {
        const [value, setValue] = useState("inbox");
        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabList aria-label="Messages">
              <Tab value="inbox">Inbox</Tab>
              <Tab value="sent">Sent</Tab>
            </TabList>
          </Tabs>
        );
      }

      render(<ControlledTabs />);
      await user.click(getTab("Sent"));

      expect(getTab("Sent")).toHaveAttribute("aria-selected", "true");
    });
  });

  it("throws a helpful error when a Tab is rendered outside Tabs", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Tab value="orphan">Orphan</Tab>)).toThrow(
      "<Tab> must be used within <Tabs>.",
    );

    vi.restoreAllMocks();
  });
});
