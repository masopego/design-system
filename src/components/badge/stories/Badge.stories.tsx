import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge";
import { BADGE_VARIANTS } from "../Badge.types";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Badge",
    variant: "neutral",
  },
  argTypes: {
    variant: { control: "inline-radio", options: BADGE_VARIANTS },
    children: { control: "text" },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Positive: Story = {
  args: { variant: "positive" },
};

export const Negative: Story = {
  args: { variant: "negative" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--space-s)" }}>
      {BADGE_VARIANTS.map((variant) => (
        <Badge key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const Mobile: Story = {
  ...AllVariants,
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
};
