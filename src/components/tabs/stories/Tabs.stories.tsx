import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useState } from "react";
import { BADGE_VARIANTS } from "../../badge";
import { Tab } from "../Tab";
import { TabList } from "../TabList";
import { TabPanel } from "../TabPanel";
import { Tabs } from "../Tabs";
import { TABS_ACTIVATION_MODES, TABS_VARIANTS, type TabBadge, type TabsProps } from "../Tabs.types";

interface TabItem {
  value: string;
  label: string;
  badge?: TabBadge;
}

const ITEMS: TabItem[] = [
  { value: "overview", label: "Overview" },
  { value: "coverage", label: "Coverage" },
  { value: "documents", label: "Documents" },
  { value: "payments", label: "Payments" },
  { value: "settings", label: "Settings" },
];

const ITEMS_WITH_BADGES: TabItem[] = [
  { value: "all", label: "All", badge: { label: "12", variant: "neutral" } },
  { value: "active", label: "Active", badge: { label: "8", variant: "positive" } },
  { value: "expired", label: "Expired", badge: { label: "4", variant: "negative" } },
];

function renderTabs(args: TabsProps, items: TabItem[] = ITEMS) {
  return (
    <Tabs {...args}>
      <TabList aria-label="Policy sections">
        {items.map(({ value, label, badge }) => (
          <Tab key={value} value={value} badge={badge}>
            {label}
          </Tab>
        ))}
      </TabList>
      {items.map(({ value, label }) => (
        <TabPanel key={value} value={value}>
          {label} content
        </TabPanel>
      ))}
    </Tabs>
  );
}

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  tags: ["autodocs"],
  args: {
    variant: "pill",
    activationMode: "automatic",
    defaultValue: "overview",
  },
  argTypes: {
    variant: { control: "inline-radio", options: TABS_VARIANTS },
    activationMode: { control: "inline-radio", options: TABS_ACTIVATION_MODES },
    value: { control: false },
    children: { control: false },
  },
  render: (args) => renderTabs(args),
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Pill: Story = {};

export const Underline: Story = {
  args: { variant: "underline" },
};

export const WithBadges: Story = {
  args: { defaultValue: "all" },
  parameters: {
    docs: {
      description: {
        story: `Available badge variants: ${BADGE_VARIANTS.join(", ")}.`,
      },
    },
  },
  render: (args) => renderTabs(args, ITEMS_WITH_BADGES),
};

export const UnderlineWithBadges: Story = {
  ...WithBadges,
  args: { defaultValue: "all", variant: "underline" },
};

export const ManualActivation: Story = {
  args: { activationMode: "manual" },
};

function ControlledExample(args: TabsProps) {
  const [value, setValue] = useState("coverage");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
      <p style={{ margin: 0 }}>
        Selected: <strong>{value}</strong>
      </p>
      {renderTabs({
        ...args,
        defaultValue: undefined,
        value,
        onValueChange: setValue,
      } as TabsProps)}
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};

export const CustomSpacing: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList
        aria-label="Policy sections"
        style={{ "--tabs-gap": "var(--space-2xl)" } as CSSProperties}
      >
        {ITEMS.map(({ value, label }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabList>
      {ITEMS.map(({ value, label }) => (
        <TabPanel key={value} value={value}>
          {label} content
        </TabPanel>
      ))}
    </Tabs>
  ),
};

export const Mobile: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      {renderTabs({ ...args, variant: "pill" }, ITEMS_WITH_BADGES)}
      {renderTabs({ ...args, variant: "underline" }, ITEMS_WITH_BADGES)}
    </div>
  ),
  args: { defaultValue: "all" },
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
};
