# Storybook Standards — Sturij Platform
**Version:** 1.1 | **Date:** 2026-04-08 | **Status:** Authoritative
**Scope:** All components in sturij-web. No exceptions.
**Enforced by:** Holly pre-flight checklist, PR review, CI pipeline

---

## 1. Purpose

This document defines how Storybook stories are written, structured, and maintained across the Sturij codebase. Every component gets a story. Every story follows these rules. This is not guidance — it is law.

Storybook serves four functions in the Sturij workflow:

| Function | How |
|----------|-----|
| Development | Build components in isolation without a running backend |
| Documentation | Self-documenting component library — the single source of truth |
| Testing | Interaction tests via play functions, visual regression via Chromatic |
| Design review | Share live component states for review before merge |

---

## 2. When to Write a Story

Write a story when:
- You are building a new component (mandatory before merge — see Section 13.2)
- A component has meaningful visual or interactive states
- You want to document behaviour for other developers or designers
- You need to test interactions without the full application

A component without a story is undocumented. Undocumented components are a liability.

---

## 3. File Naming & Location

### Location

All stories live in `src/stories/`. Not alongside the component.

```
src/
├── components/
│   └── Button/
│       └── Button.tsx
├── stories/
│   └── Button.stories.tsx
```

### Naming

| Rule | Example |
|------|---------|
| Extension | `.stories.tsx` — always TypeScript + JSX |
| Casing | PascalCase matching the component |
| Naming | `ComponentName.stories.tsx` |
| Forbidden | `test.stories.tsx`, `components.stories.tsx`, `.js`, `.jsx` |

---

## 4. Story Structure — CSF Format

Every story file has two parts: a default export (meta) and named exports (stories).

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button/Button';

const meta = {
  title: 'Components/Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Primary action trigger. One primary button per view.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Save Changes',
    variant: 'primary',
  },
};
```

### Rules

- Meta **must** use `satisfies Meta<typeof Component>` for TypeScript inference
- Always define `type Story = StoryObj<typeof meta>` at the top
- Named exports use **UpperCamelCase** — `Default`, `LoadingState`, `WithError`
- Always include `tags: ['autodocs']`
- Always include a component-level description (see Section 12)

### Custom Render

Use `render` only when a component genuinely needs a wrapper. Always spread `args` to preserve Controls.

```tsx
export const InFormContext: Story = {
  args: { label: 'Submit', variant: 'primary' },
  render: (args) => (
    <form onSubmit={(e) => e.preventDefault()}>
      <Button {...args} />
    </form>
  ),
};
```

---

## 5. Args — Component Inputs

Args map to React props and drive the Controls panel. Three scopes, from specific to broad:

| Scope | Where defined | Applies to |
|-------|---------------|------------|
| Story-level | `args` on the named export | That story only |
| Component-level | `args` in the meta object | All stories in the file (overridable) |
| Global | `.storybook/preview.ts` | Every story (use sparingly) |

### Composing Args

```tsx
export const Primary: Story = {
  args: { label: 'Confirm', variant: 'primary' },
};

export const PrimaryLong: Story = {
  args: {
    ...Primary.args,
    label: 'Confirm and save all changes to this work order',
  },
};
```

### Rules

- Args must be **plain JSON-serialisable values** — strings, numbers, booleans, arrays, objects
- Never pass live functions — use `action()` from `@storybook/test` for callbacks
- Every story must have meaningful, representative args — no empty stories

---

## 6. Controls — Exposing Props in the UI

TypeScript types auto-generate controls. Customise with `argTypes` when needed:

```tsx
const meta = {
  component: StatusBadge,
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'pending', 'cancelled', 'complete'],
      description: 'Current status of the work order',
      table: {
        type: { summary: 'StatusType' },
        defaultValue: { summary: 'pending' },
      },
    },
    onDismiss: { action: 'dismissed' },
    internalId: { table: { disable: true } },
  },
} satisfies Meta<typeof StatusBadge>;
```

### Control Types

| Type | Use for |
|------|---------|
| `'text'` | Short strings |
| `'number'` | Numeric values |
| `'boolean'` | Toggles |
| `'select'` | Enums / union types |
| `'radio'` | Small sets (2-4 options) |
| `'color'` | Colour pickers — **must use design tokens, not hex** |
| `'date'` | Date values |
| `'object'` | Complex objects |

---

## 7. Decorators — Wrappers and Context

Decorators wrap stories with providers, layout, or context. Three scopes:

| Scope | Where | Priority |
|-------|-------|----------|
| Global | `.storybook/preview.ts` | Lowest (applied first) |
| Component | `meta.decorators` | Middle |
| Story | `story.decorators` | Highest (applied last) |

### Standard Sturij Decorator — Theme Provider

```tsx
// .storybook/preview.tsx
import { ThemeProvider } from '../src/design-system/ThemeProvider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

### When to Use

- Wrapping with context providers (Theme, Router, QueryClient)
- Adding layout padding/background
- Mocking the AppShell for page-level stories
- Providing dark theme variant

### When NOT to Use

- Adding content that belongs in the story itself
- Mutating global state

---

## 8. Play Functions — Interaction Testing

Play functions run after render and simulate user interactions. They are your component-level integration tests.

```tsx
import { expect } from '@storybook/test';

export const FilledAndSubmitted: Story = {
  play: async ({ canvas, userEvent }) => {
    const titleInput = canvas.getByLabelText('Work Order Title');
    await userEvent.type(titleInput, 'Replace kitchen worktop', { delay: 50 });

    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await expect(canvas.getByText('Work order saved')).toBeInTheDocument();
  },
};
```

### For Modals and Overlays

Modals render outside the component root. Use `screen` from `storybook/test`:

```tsx
import { screen } from 'storybook/test';

export const WithModal: Story = {
  play: async ({ userEvent }) => {
    await userEvent.click(screen.getByRole('button', { name: /open/i }));
    await expect(screen.getByRole('dialog')).toBeVisible();
  },
};
```

### Rules

- Always `await` userEvent calls — they are async
- Use `canvas.getBy*` over raw DOM selectors
- Every play function must include at least one `expect` assertion
- One scenario per story — don't combine multiple flows

### When to Write Play Functions

- Form validation flows
- Modal open/close interactions
- Dropdown selection behaviour
- Multi-step user flows
- Conditional rendering triggered by user action
- **Drawer interactions** (Sturij AppShell drawers — test open, close, pin)
- **Accordion expand/collapse** (test pin behaviour, auto-close siblings)

---

## 9. Sidebar Hierarchy

Structure the sidebar so anyone can find a component in under 5 seconds.

### Path Convention

Use `/` as separator. Maximum 3 levels deep.

```tsx
const meta = {
  title: 'Components/Forms/TextInput',
  component: TextInput,
} satisfies Meta<typeof TextInput>;
```

### Sturij Sidebar Structure

```
Design System
  ├── Tokens
  ├── Typography
  └── Colours

Components
  ├── Inputs
  │   ├── Button
  │   ├── TextInput
  │   └── Select
  ├── Feedback
  │   ├── Toast
  │   └── StatusBadge
  ├── Navigation
  │   ├── Sidebar
  │   ├── Breadcrumb
  │   └── Signpost
  ├── Data Display
  │   ├── Table
  │   ├── OrderCard
  │   └── Accordion
  ├── Overlays
  │   ├── Modal
  │   └── Drawer
  └── Layout
      ├── AppShell
      ├── PageStandard
      └── SlotLayout

Pages
  ├── Canvas
  ├── Pipeline
  ├── Quotes
  ├── Calendar
  └── Knowledge
```

### Naming

- Sidebar labels use sentence case: `Default`, `Loading state`, `With error`
- UpperCamelCase in code: `LoadingState` → renders as `Loading State`
- Don't prefix with component name: `Button/Primary` not `Button/ButtonPrimary`

---

## 10. Required Story Variants

Every component **must** include these:

### Mandatory

| Story | Purpose |
|-------|---------|
| `Default` | Standard state, all required props, no special conditions |
| `DarkTheme` | Component on dark background using Sturij dark tokens |
| All interactive states | Disabled, Loading, Error, Empty — whichever apply |

### For Interactive Components

| Story | Purpose |
|-------|---------|
| `Focused` | Keyboard focus state |
| `Hovered` | Hover state (use play function) |
| `Active` | Pressed/active state |

### Sturij-Specific Variants

| Story | Purpose |
|-------|---------|
| `InDrawer` | Component rendered inside an AppShell drawer context |
| `Mobile` | Component at 375px viewport width |
| `Tablet` | Component at 768px viewport width |
| `WithRealData` | Component with production-representative data, not lorem ipsum |

### DarkTheme Pattern

```tsx
export const DarkTheme: Story = {
  name: 'Dark theme',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" className="bg-surface-inverse p-8">
        <Story />
      </div>
    ),
  ],
};
```

### Mobile Pattern

```tsx
export const Mobile: Story = {
  name: 'Mobile (375px)',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: { ...Default.args },
};
```

---

## 11. Anti-Patterns — What NOT to Do

### Hardcoded Colours

```tsx
// BANNED — raw hex
args: { backgroundColor: '#1a1a2e' }

// CORRECT — design tokens
args: { backgroundColor: 'var(--color-surface-inverse)' }
```

If the token doesn't exist, raise it with the design system. Don't invent colours.

### Empty Stories

```tsx
// BANNED — tells you nothing
export const MyStory: Story = {};

// CORRECT — representative args
export const Default: Story = {
  args: { title: 'Work Order #1042', status: 'in-progress', assignee: 'James M.' },
};
```

### Internal Data Generation

```tsx
// BANNED — story generates its own data
render: () => { const data = generateFakeOrders(); return <OrderTable orders={data} />; }

// CORRECT — data as args
args: { orders: [{ id: '1042', title: 'Kitchen worktop', status: 'pending' }] }
```

### Other Violations

| Don't | Do Instead |
|-------|-----------|
| Use `render` when plain args work | Spread args onto the component |
| Write one mega-story with internal state | Separate stories per state |
| Leave descriptions empty | Write what the component does and when to use it |
| Nest deeper than 3 levels | Flatten the hierarchy |
| Import from `@storybook/test` in production code | Only in story files and play functions |
| Use `fontWeight: 700` or `600` in stories | Max `500` — Sturij uses Inter Light/Regular/Medium only |
| Use emoji in component labels | 1px muted line icons or text labels only |

---

## 12. Descriptions — Mandatory Documentation

Every story file must have a component-level description explaining **what** and **when**.

```tsx
const meta = {
  parameters: {
    docs: {
      description: {
        component: `
**OrderCard** displays a summary of a single work order.

Use on the Work Orders list view, the Dashboard summary panel, and anywhere a compact 
work order summary is needed. Do not use for detailed views — use WorkOrderDetail for that.

**AppShell context:** Renders in the Pipeline drawer as an accordion row.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof OrderCard>;
```

Individual stories can also have descriptions:

```tsx
export const Overdue: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Displays when the due date has passed. Status badge turns red. Overdue indicator shown.',
      },
    },
  },
};
```

---

## 13. Sturij-Specific Rules

These are non-negotiable. They exist to maintain design consistency, protect the token system, and keep the component library useful.

### 13.1 File Location

All stories in `src/stories/`. Not alongside components. One location, one source of truth.

### 13.2 Story Before Merge

Every new component gets a story before the PR merges. No exceptions. The story is part of the component's definition — it proves the component works in isolation.

**Holly must not merge any PR that adds a component without a corresponding story file.**

### 13.3 No Hardcoded Colours

Never use raw colour values anywhere in a story file — not in args, decorators, inline styles, or background parameters. Always use Sturij design tokens (`var(--color-*)` or Tailwind classes).

### 13.4 AppShell Awareness

Components in Sturij render inside the AppShell — drawers, slots, and the canvas area. Stories should demonstrate how the component behaves in these contexts:

```tsx
export const InDrawer: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 360, background: 'var(--color-surface-drawer)', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
```

### 13.5 Token Compliance

Every visual property must reference the Sturij token system. This includes:

| Property | Token pattern |
|----------|--------------|
| Background | `var(--color-surface-*)` or Tailwind `bg-surface-*` |
| Text | `var(--color-text-*)` or Tailwind `text-*` |
| Border | `var(--color-border-*)` or Tailwind `border-*` |
| Spacing | Tailwind spacing scale (`p-4`, `gap-3`, `m-2`) |
| Font weight | `300` (light), `400` (regular), `500` (medium) — never `600` or `700` |
| Font family | `Inter` only — via the design system, never hardcoded |
| Border radius | Token-defined values, not arbitrary pixels |

### 13.6 Responsive Stories

Every component that appears in the main content area must have stories at three breakpoints:

| Breakpoint | Width | Story name |
|-----------|-------|------------|
| Mobile | 375px | `Mobile` |
| Tablet | 768px | `Tablet` |
| Desktop | 1440px | `Default` (this is the baseline) |

Drawer components are constrained to drawer width (360px) and don't need responsive variants.

### 13.7 Accessibility in Stories

Every interactive component story must verify basic accessibility:

```tsx
export const AccessibleForm: Story = {
  play: async ({ canvas }) => {
    // Verify all form fields have labels
    const inputs = canvas.getAllByRole('textbox');
    for (const input of inputs) {
      await expect(input).toHaveAccessibleName();
    }
    
    // Verify buttons have accessible names
    const buttons = canvas.getAllByRole('button');
    for (const button of buttons) {
      await expect(button).toHaveAccessibleName();
    }
  },
};
```

### 13.8 Visual Regression with Chromatic

Stories are the source material for Chromatic visual regression tests. This means:

- Every meaningful visual state must be a separate story (not toggled via internal state)
- Stories must be deterministic — no randomised data, no `Date.now()`, no animation states
- Use `parameters.chromatic.delay` for components that animate on mount
- Use `parameters.chromatic.disableSnapshot` for interaction-only stories

```tsx
export const AnimatedEntry: Story = {
  parameters: {
    chromatic: { delay: 500 }, // Wait for animation to complete
  },
};

export const InteractionOnly: Story = {
  parameters: {
    chromatic: { disableSnapshot: true }, // Don't screenshot this one
  },
};
```

---

## 14. Quality Checklist — Before Every PR

Use this before merging any PR that includes story files:

- [ ] Story file exists in `src/stories/`
- [ ] File named `ComponentName.stories.tsx` (PascalCase, `.stories.tsx`)
- [ ] `Default` story is present with meaningful args
- [ ] All interactive states have stories (disabled, loading, error, empty)
- [ ] `DarkTheme` story is present
- [ ] `Mobile` story is present (for content-area components)
- [ ] `InDrawer` story is present (for drawer components)
- [ ] No hardcoded colour values anywhere in the file
- [ ] All visual properties use Sturij design tokens
- [ ] Component description written (what + when + AppShell context)
- [ ] `tags: ['autodocs']` is set in meta
- [ ] TypeScript correct — `satisfies Meta<typeof Component>`, no `any`
- [ ] Play functions include assertions
- [ ] No `fontWeight` above `500`
- [ ] No emoji in labels — text or 1px line icons only
- [ ] Args represent real production data, not lorem ipsum
- [ ] Chromatic considerations applied (delay, disable where needed)

---

## 15. Integration with Holly Workflow

### Before Holly Builds a Component

The sprint brief must specify:
- Which Page Standard pattern the component follows
- Which existing components to reuse (not reinvent)
- Which tokens are in scope
- The sidebar path for the story (`title` in meta)

### After Holly Builds a Component

Holly must:
1. Create the story file in `src/stories/`
2. Include all mandatory variants (Default, DarkTheme, interactive states, Mobile)
3. Write the component description
4. Run `npm run storybook` locally to verify
5. Screenshot the Storybook output for Mark's review

### Holly Must NOT

- Create a component without a story
- Skip DarkTheme or Mobile variants
- Use hardcoded colours or arbitrary values
- Use `fontWeight` above 500
- Skip the component description
- Merge without Mark's visual sign-off

---

*This document is enforced across all Sturij component development. It is referenced by the Holly Rules Engine, sprint briefs, and PR review checklists. Update when Storybook version changes or new patterns emerge.*
