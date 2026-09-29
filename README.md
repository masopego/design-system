# Design System: Tabs & Badge 🗂️

Tabs are everywhere: settings pages, dashboards, inboxes... and they look simple until you try to build them
right 🤓. This is my version of the **Tabs** component for the design system home test: two visual variants, an
optional **Badge** on every tab, keyboard navigation and a lot of care for accessibility. Come in, **enjoy my
code and click (or tab) around**!

## ▶️ To start

You will need **Node.js 24 or later** and **pnpm 11.18.0**. The easiest way to get the right pnpm version is
[Corepack](https://nodejs.org/api/corepack.html), which reads it from `package.json`:

```bash
corepack enable
```

- Start by **cloning or downloading this project**.
- Execute these commands in your terminal:

```bash
pnpm install && pnpm storybook
```

The design system is now running in Storybook at http://localhost:6006!

Other commands you may need:

| Command                | What it does                                   |
| ---------------------- | ---------------------------------------------- |
| `pnpm test`            | Runs the tests once                            |
| `pnpm tsc`             | Checks the TypeScript types                    |
| `pnpm check`           | Lints and checks the formatting with Biome     |
| `pnpm check:fix`       | Lints and formats the code, fixing what it can |
| `pnpm build-storybook` | Builds a static version of Storybook           |

The designs live in the [Figma file](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=0-1&t=4pG7NN6HKxgxroDz-1).

<br>

## ▶️ How to use it

```tsx
import { Tab, TabList, TabPanel, Tabs } from "./src";
import "./src/styles/global.scss"; // design tokens, once at the root of the app

<Tabs defaultValue="all" variant="pill">
  <TabList aria-label="Policies">
    <Tab value="all" badge={{ label: "12" }}>
      All
    </Tab>
    <Tab value="active" badge={{ label: "8", variant: "positive" }}>
      Active
    </Tab>
    <Tab value="expired" badge={{ label: "4", variant: "negative" }}>
      Expired
    </Tab>
  </TabList>
  <TabPanel value="all">…</TabPanel>
  <TabPanel value="active">…</TabPanel>
  <TabPanel value="expired">…</TabPanel>
</Tabs>;
```

| Component  | Main props                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Tabs`     | `variant` (`pill` \| `underline`), `defaultValue` or `value` + `onValueChange`, `activationMode` (`automatic` \| `manual`) |
| `TabList`  | `aria-label` or `aria-labelledby` (one of them is required)                                                                |
| `Tab`      | `value`, `badge` (`{ label, variant }`)                                                                                    |
| `TabPanel` | `value`                                                                                                                    |
| `Badge`    | `variant` (`neutral` \| `positive` \| `negative`)                                                                          |

Every component also accepts the native props of its HTML element (`className`, `id`, `ref`, `data-*`...).

<br>

## ▶️ LogBook

<br>

My goal with this test was not only to build a component that looks like the design, but one that another team
could use tomorrow without reading its code: a small and typed API, tested behaviour and every decision written
down 🤖. Here is the story of how it went.

<br>

**Structure: one folder per component 🧱**

Every component is self-contained, so it can be moved, reviewed or deleted without touching anything else:

```
src/
├── styles/                  → design tokens shared by every component
├── components/
│   ├── badge/
│   │   ├── Badge.tsx
│   │   ├── Badge.types.ts
│   │   ├── Badge.module.scss
│   │   ├── index.ts         → public API of the component
│   │   ├── stories/
│   │   └── __tests__/
│   └── tabs/                → Tabs, TabList, Tab, TabPanel and their context
└── index.ts                 → public API of the design system
```

The types live in their own `*.types.ts` file, next to the constants they come from (`BADGE_VARIANTS`,
`TABS_VARIANTS`...). The components only contain logic, and the constants are the single source of truth for the
types, the tests and the Storybook controls: adding a variant updates all of them at once.

<br>

**Design tokens 📏**

I started with the Badge because it is the smallest piece and the Tab depends on it. Before writing any component
I turned the Figma foundations into tokens: the spacing scale, the typography and the colors, exposed as CSS custom
properties in `src/styles/global.scss`.

<br>

**Styling with Sass and CSS Modules 🎨**

No CSS frameworks, as requested: [`Sass`](https://sass-lang.com/) with CSS Modules, so class names never collide.
Some rules I followed:

- **Mobile** means a viewport of 768px or less, so it is a media query and not a prop. Media queries can't read
  CSS custom properties, so the breakpoint lives in a Sass mixin.
- **`rem` for font sizes and spacing**, so the components respect the font size chosen by the user.
- The tabs use `min-height` instead of `height`, so they can grow if the user zooms the text.
- Hover styles only apply on devices with a real pointer (`@media (hover: hover)`), so they don't get "stuck"
  after a tap on mobile.

<br>

**The Badge 🏷️**

A small, non-interactive `<span>` with three variants. Its API is as close to a native element as possible: it
accepts every `span` prop, merges its `className` with yours and receives a `ref` (no `forwardRef` needed in
React 19).

The variants only change one component token, `--badge-background`, so adding a new one is a one-line class.

<br>

**The Tabs: a compound component 🧩**

`Tabs`, `TabList`, `Tab` and `TabPanel` share their state through a React context, so the markup stays readable
and flexible. If one of them is rendered outside `<Tabs>`, it throws a clear error.

`Tabs` can be **uncontrolled** (`defaultValue`) or **controlled** (`value` + `onValueChange`), and TypeScript
does not allow both at the same time. `onValueChange` is not called when you click the tab that is already
selected.

The Badge is added through the Tab's API, as the acceptance criteria ask: `badge={{ label: "3", variant:
"negative" }}`.

<br>

**Accessibility 👀**

The Tabs follow the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

- `tablist`, `tab` and `tabpanel` roles, with every tab linked to its panel through `aria-controls` and
  `aria-labelledby`.
- **Roving tabindex**: the Tab key moves into the selected tab and then to its panel; the arrow keys move between
  tabs, wrapping around, and Home and End jump to the first and last tab.
- Two **activation modes**: `automatic` selects a tab as soon as it gets focus, and `manual` lets you move with
  the arrows and select with Enter or Space.
- A `TabList` without an accessible name does not compile: its props require `aria-label` or `aria-labelledby`.
- Visible focus with `:focus-visible`.
- **Windows High Contrast mode** removes background colors, so the selected tab would disappear. In
  `forced-colors` mode it uses system colors, and the Badge gets a visible border.

A funny bug: a screen reader read the tab "Inbox" with a badge "3" as **"Inbox3"**. The label and the badge are
separate elements with no text between them, and the flex `gap` is only visual. A single space in the markup fixed
it: screen readers read it, and it takes no room on screen because whitespace between flex items is not rendered.

For the Badge, color is never the only way to convey meaning: "positive" or "negative" are not announced by
screen readers, so the text itself must explain it.

<br>

**Testing: Vitest + React Testing Library 📝**

The tests are written from the user's point of view with [`Vitest`](https://vitest.dev/),
[`React Testing Library`](https://testing-library.com/docs/react-testing-library/intro/) and `user-event`: they
look for elements by their role and accessible name, and use the real keyboard and mouse. They live in a
`__tests__` folder next to each component and cover the ARIA semantics, keyboard navigation, both activation
modes, controlled and uncontrolled use and the Badge inside a Tab.

<br>

**Storybook 📚**

Every variant and state has its own story, including mobile (with Storybook's viewport), manual activation,
controlled mode and a custom spacing example. The props tables are generated with `autodocs`.

I tried to remove all the `argTypes` and let Storybook infer the controls from the types, but after checking
the build I found two limits of `react-docgen`: it can't resolve `(typeof BADGE_VARIANTS)[number]`, and it can't
read the props of a union type like `TabsProps`. So the variant controls are declared, taking their options from
the same constants as the types. Each remaining `argType` has a comment explaining why it is there.

<br>

**Clean code tooling 🧹**

[`Biome`](https://biomejs.dev/) lints and formats the code, and TypeScript runs in strict mode. Biome's
accessibility rules complained about the `tabIndex={0}` in `TabPanel`, but the WAI-ARIA pattern needs it to make
the panel reachable when it has no focusable content, so I disabled that rule on that single line, explaining
why.

<br>

## ▶️ Requisites

- Switch between the variants of the `Tabs`, according to the design (`pill` and `underline`) ✅
- Add a `Badge` to the `Tab` using the Tab's API ✅
- Choose between the `Badge` variants (`neutral`, `positive` and `negative`) using the Tab's API ✅
- Mobile and desktop versions, according to the design ✅
- Accessible and reusable components ✅
- CSS written from scratch, without CSS frameworks ✅
- Raw React implementation, without component libraries ✅
- Showcase in Storybook ✅
