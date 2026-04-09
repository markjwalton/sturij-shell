# STORYBOOK-RULES.md
## Storybook Standards for the Sturij Project

> This document defines how we write, structure, and maintain Storybook stories across the Sturij codebase. Follow these rules for every component. No exceptions.

---

## 1. What Is a Story and When to Write One

A **story** captures the rendered state of a UI component at a specific point in time, given a specific set of inputs (args). Think of a story as a visual test case — it says "here is my component, and here is exactly how it should look in this scenario."

### Write a story when:
- You are building a new component (before merging — see Sturij rules at the end)
- A component has meaningful visual or interactive states (disabled, loading, error, empty, etc.)
- You want to document how a component behaves for other developers or designers
- You need to test interactions without spinning up the full app

### Stories serve multiple purposes:
- **Development** — build components in isolation, without needing a running backend
- **Documentation** — self-documenting component library for the team
- **Testing** — interaction tests via play functions, visual regression via Chromatic
- **Design review** — share live component states with designers

---

## 2. Story File Naming Conventions

Story files live **alongside the component** they document, or in `src/stories/` for Sturij (see Section 11).

### Naming pattern:
```
ComponentName.stories.tsx
```

### Examples:
```
Button.stories.tsx
OrderCard.stories.tsx
StatusBadge.stories.tsx
WorkOrderForm.stories.tsx
```

### Rules:
- Always use `.stories.tsx` (TypeScript + JSX). Never `.js` or `.jsx`.
- Match the component file name exactly. `Button.tsx` → `Button.stories.tsx`
- Use PascalCase for the file name
- Never use generic names like `test.stories.tsx` or `components.stories.tsx`

---

## 3. Story Structure — Default Export, Named Exports, Meta

Stories follow the **Component Story Format (CSF)**, an ES module standard. Every story file has two parts:

1. **Default export (meta)** — describes the component and configures Storybook
2. **Named exports** — individual story variants

### Minimal example:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

// ── Meta (default export) ────────────────────────────────────────────
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Primary action button. Use for the most important action on any page or form.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories (named exports) ──────────────────────────────────────────
export const Default: Story = {
  args: {
    label: 'Save Changes',
    variant: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Save Changes',
    variant: 'primary',
    disabled: true,
  },
};
```

### Key rules:
- The `meta` object **must** use `satisfies Meta<typeof Component>` for full TypeScript inference
- Always export `meta` as `export default meta`
- Define `type Story = StoryObj<typeof meta>` at the top for reuse
- Named exports use **UpperCamelCase** (`Default`, `Disabled`, `LoadingState` — not `loading_state` or `loadingState`)
- Always include `tags: ['autodocs']` to generate automatic documentation pages

### Custom render (when needed):

Use `render` when a component needs a wrapper to display correctly:

```tsx
export const InFormContext: Story = {
  args: {
    label: 'Submit',
    variant: 'primary',
  },
  render: (args) => (
    <form onSubmit={(e) => e.preventDefault()}>
      <Button {...args} />
    </form>
  ),
};
```

> **Important:** Always spread `args` onto the component inside a custom `render`. This keeps Controls working.

---

## 4. Args — What They Are and How to Use Them

**Args** are Storybook's way of defining the inputs to a component. They map directly to React props and drive the Controls panel.

When an arg's value changes, the component re-renders instantly — no page reload, no code change needed.

### Three levels of args:

#### Story-level args (most common)
Only apply to that specific story:

```tsx
export const Primary: Story = {
  args: {
    label: 'Confirm Order',
    variant: 'primary',
    size: 'md',
  },
};
```

#### Component-level args (defaults for all stories)
Set in the meta object. Apply to every story unless overridden:

```tsx
const meta = {
  component: Button,
  args: {
    // All Button stories start with these defaults
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Button>;
```

#### Global args (rare — avoid unless truly global)
Defined in `.storybook/preview.ts`. Use for things like locale or theme that apply everywhere.

### Composing args from other stories:

```tsx
export const Primary: Story = {
  args: {
    label: 'Confirm',
    variant: 'primary',
  },
};

export const PrimaryLong: Story = {
  args: {
    ...Primary.args,               // inherit from Primary
    label: 'Confirm and save all changes to this work order',
  },
};
```

### Rules:
- Keep args as **plain JSON-serialisable values** — strings, numbers, booleans, arrays, objects
- Do not pass live functions or class instances as args (use `action()` from `@storybook/test` for callbacks)
- Use `argTypes` in meta to customise how controls render (see Section 5)

---

## 5. Controls — How to Expose Component Props

The **Controls addon** auto-generates a UI panel from your component's TypeScript types. This lets anyone edit props without touching code.

### Auto-generated controls:
If you're using TypeScript, Storybook infers controls from your prop types automatically. No extra config needed for most cases.

### Customising controls with `argTypes`:

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
    colour: {
      control: 'color',  // Shows a colour picker
    },
    onDismiss: {
      action: 'dismissed',  // Logs to Actions panel when called
    },
  },
} satisfies Meta<typeof StatusBadge>;
```

### Common control types:
| Type | Use for |
|------|---------|
| `'text'` | Short string inputs |
| `'number'` | Numeric values |
| `'boolean'` | True/false toggles |
| `'select'` | Enum / union types |
| `'radio'` | Small sets of options |
| `'color'` | Colour pickers (use tokens, not raw hex — see Section 11) |
| `'date'` | Date values |
| `'object'` | Complex objects |

### Hiding internal props:
```tsx
argTypes: {
  internalId: { table: { disable: true } },
}
```

---

## 6. Decorators — When and How to Use Them

A **decorator** wraps a story in extra rendering or context. Use them when a component needs a provider, a layout wrapper, or global context to display correctly.

### Adding spacing/layout:

```tsx
const meta = {
  component: ToastNotification,
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', minHeight: '200px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToastNotification>;
```

### Providing context (e.g., theme, router, auth):

```tsx
// .storybook/preview.tsx — applies to ALL stories
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

### Story-level decorator for one-off context:

```tsx
export const WithSidebar: Story = {
  decorators: [
    (Story) => (
      <AppShell>
        <Story />
      </AppShell>
    ),
  ],
};
```

### Decorator scope (priority order — last wins):
1. **Global** (`.storybook/preview.ts`) — applies to every story
2. **Component** (meta `decorators`) — applies to all stories in that file
3. **Story** (story `decorators`) — applies to one story only

### When to use decorators:
- ✅ Wrapping with a context provider (ThemeProvider, RouterProvider, QueryClient)
- ✅ Adding layout padding/background when a component needs it
- ✅ Mocking a page-level shell for full-page stories
- ✅ Providing dark theme for dark mode stories

### When NOT to use decorators:
- ❌ Don't use decorators to add content that belongs in the story itself
- ❌ Don't mutate global state inside a decorator

---

## 7. Play Functions — Interaction Testing

A **play function** is a script that runs automatically after the story renders. It simulates user interactions — clicks, typing, form submission — and lets you verify the component responds correctly.

Use the `canvas` object (scoped Testing Library queries) and `userEvent` to interact with the DOM.

### Basic example — form submission:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from '@storybook/test';
import { WorkOrderForm } from './WorkOrderForm';

const meta = {
  component: WorkOrderForm,
} satisfies Meta<typeof WorkOrderForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilledAndSubmitted: Story = {
  play: async ({ canvas, userEvent }) => {
    // Find the input by label
    const titleInput = canvas.getByLabelText('Work Order Title');
    await userEvent.type(titleInput, 'Replace kitchen worktop', { delay: 50 });

    const prioritySelect = canvas.getByLabelText('Priority');
    await userEvent.selectOptions(prioritySelect, 'high');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // Assert the outcome
    await expect(canvas.getByText('Work order saved')).toBeInTheDocument();
  },
};
```

### Querying outside the story canvas:

For modals and dialogs that render outside the component root, import `screen` from `storybook/test`:

```tsx
import { screen } from 'storybook/test';

export const WithModal: Story = {
  play: async ({ userEvent }) => {
    await userEvent.click(screen.getByRole('button', { name: /open/i }));
    await expect(screen.getByRole('dialog')).toBeVisible();
  },
};
```

### When to write play functions:
- ✅ Form validation (fill, submit, check errors)
- ✅ Modal open/close interactions
- ✅ Dropdown selection
- ✅ Any story that depends on a multi-step user flow
- ✅ Components with conditional rendering triggered by user action

### Play function rules:
- Always `await` userEvent calls — they are async
- Use `canvas.getBy*` queries in preference to raw DOM selectors
- Add assertions (`expect`) — a play function without assertions is just animation
- Keep play functions focused on **one scenario per story**

---

## 8. Naming and Hierarchy in the Sidebar

Storybook's sidebar is your component library's navigation. Structure it so that anyone can find a component in under 5 seconds.

### Setting the title:

Use `/` as a path separator to create hierarchy:

```tsx
const meta = {
  title: 'Components/Forms/TextInput',
  component: TextInput,
} satisfies Meta<typeof TextInput>;
```

This renders as:
```
Components
  └── Forms
        └── TextInput
              ├── Default
              ├── Error
              └── Disabled
```

### Sturij sidebar structure:

```
Design System
  └── Tokens
  └── Typography
  └── Colours

Components
  └── Inputs
        └── Button
        └── TextInput
        └── Select
  └── Feedback
        └── Toast
        └── StatusBadge
  └── Navigation
        └── Sidebar
        └── Breadcrumb
  └── Data Display
        └── Table
        └── OrderCard
  └── Overlays
        └── Modal
        └── Drawer

Pages
  └── Dashboard
  └── Work Orders
```

### Naming rules:
- Use `/` separators for nesting. Max 3 levels deep.
- Use sentence case for story names in the sidebar: `Default`, `Loading state`, `With error`
- Named exports use UpperCamelCase in code: `LoadingState` — Storybook splits this to `Loading State` automatically
- Don't prefix story names with the component name: `Button/Primary` not `Button/ButtonPrimary`

### Story name overrides:

```tsx
export const DarkBackground: Story = {
  name: 'On dark background',  // overrides the sidebar label
  args: { ... },
};
```

---

## 9. Story Variants to Always Include

Every component story file **must** include these variants at minimum:

### Required stories:

| Story name | Purpose |
|------------|---------|
| `Default` | The standard state, all required props, no special conditions |
| `Disabled` | If the component supports a disabled state |
| `Loading` | If the component has an async/loading state |
| `Error` | If the component can display validation errors or failure states |
| `Empty` | If the component renders differently when there's no data |
| `DarkTheme` | The component on a dark background using theme tokens |
| `AllVariants` | (Optional) A composite showing all size/variant options at once |

### For interactive components, also include:
| Story name | Purpose |
|------------|---------|
| `Focused` | Keyboard focus state |
| `Hovered` | Hover state (use `play` function if needed) |
| `Active` | Active/pressed state |

### Example — a complete Button story file:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Primary action trigger. Use for form submissions, confirmations, and primary page actions. One primary button per view.',
      },
    },
  },
  args: {
    label: 'Confirm',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};
```

---

## 10. What NOT to Do — Anti-Patterns

### ❌ Don't hardcode colours or values
```tsx
// BAD — hardcoded hex
args: { backgroundColor: '#1a1a2e' }

// GOOD — use design tokens
args: { backgroundColor: 'var(--color-surface-inverse)' }
```

### ❌ Don't write stories without meaningful args
```tsx
// BAD — empty story tells you nothing
export const MyStory: Story = {};

// GOOD — give it real representative args
export const Default: Story = {
  args: {
    title: 'Work Order #1042',
    status: 'in-progress',
    assignee: 'James M.',
  },
};
```

### ❌ Don't skip the Default story
Every component needs a `Default` story. It's the baseline. Everything else is a variation.

### ❌ Don't mock data inside the story component
```tsx
// BAD — story creates its own data
export const WithData: Story = {
  render: () => {
    const data = generateFakeOrders(); // ❌
    return <OrderTable orders={data} />;
  },
};

// GOOD — pass data as args
export const WithData: Story = {
  args: {
    orders: [
      { id: '1042', title: 'Kitchen worktop', status: 'pending' },
    ],
  },
};
```

### ❌ Don't use `render` when plain args will do
Custom render functions break Controls. Only use `render` when a wrapper is genuinely required.

### ❌ Don't write one giant story with internal state toggling
```tsx
// BAD — one story to rule them all
export const AllStates: Story = {
  render: () => {
    const [state, setState] = useState('default');
    return <Button state={state} onChange={setState} />;
  },
};

// GOOD — separate stories per state
export const Default: Story = { args: { state: 'default' } };
export const Active: Story = { args: { state: 'active' } };
export const Disabled: Story = { args: { state: 'disabled' } };
```

### ❌ Don't leave story descriptions empty
Every story file must have a component description. Undescribed components are a maintenance liability.

### ❌ Don't nest stories more than 3 levels deep
`Components/Forms/Inputs/SpecialInput` is too deep. Flatten where possible.

### ❌ Don't import from test utilities in production component code
Story files and play functions can import from `@storybook/test`. The component itself cannot.

---

## 11. Sturij-Specific Rules

These rules are non-negotiable for the Sturij project. They exist to maintain design consistency, protect the token system, and keep the component library useful.

---

### 11.1 Story file location

**All component stories live in `src/stories/`.**

```
src/
├── components/
│   └── Button/
│       └── Button.tsx
├── stories/
│   └── Button.stories.tsx   ← here
```

Do not place story files next to component files. The `src/stories/` folder is the single source of truth for all stories.

---

### 11.2 Story before merge

**Every new component gets a story before the PR merges.**

This is a hard rule. No component enters the codebase without a corresponding story. If a PR adds a component without a story file, it is not ready to merge.

The story file counts as part of the component's definition — it proves the component works in isolation and documents it for the team.

---

### 11.3 Mandatory story variants

Every story file **must** include these three variants at minimum:

1. **`Default`** — the component in its standard, out-of-the-box state
2. **All interactive states** — disabled, loading, error, focused, hover, active, empty — whichever apply
3. **`DarkTheme`** — the component rendered on a dark background using the Sturij dark theme tokens

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

---

### 11.4 No hardcoded colours

**Never use raw colour values in stories.** Always reference Sturij design tokens.

```tsx
// ❌ BANNED
args: {
  background: '#0f172a',
  borderColor: 'rgba(255,255,255,0.12)',
}

// ✅ CORRECT — use token references
args: {
  background: 'var(--color-surface-dark)',
  borderColor: 'var(--color-border-subtle)',
}
```

This applies to:
- `args` values
- Inline styles in decorators
- Background parameters
- Any hardcoded string that represents a colour

If the token you need doesn't exist, raise it with the design system team. Don't invent a colour.

---

### 11.5 Story descriptions are mandatory

Every story file must have a component-level description in the meta. The description must explain:
1. **What the component does** — its role and function
2. **When to use it** — the correct context, and where it fits in the UI

```tsx
const meta = {
  title: 'Components/Data Display/OrderCard',
  component: OrderCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**OrderCard** displays a summary of a single work order — its title, status, assignee, and due date.

Use on the Work Orders list view, the Dashboard summary panel, and anywhere a compact work order summary is needed. 
Do not use for detailed work order views — use \`WorkOrderDetail\` for that.
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
        story: 'Displays when the due date has passed and the order is not yet complete. The status badge turns red and an overdue indicator is shown.',
      },
    },
  },
  args: {
    status: 'overdue',
    dueDate: '2024-01-01',
  },
};
```

---

### 11.6 Story quality checklist (before merging)

Use this before every PR that includes story files:

- [ ] Story file exists in `src/stories/`
- [ ] `Default` story is present
- [ ] All interactive states have stories
- [ ] `DarkTheme` story is present
- [ ] No hardcoded colour values anywhere in the story file
- [ ] Component description is written and explains what + when
- [ ] `tags: ['autodocs']` is set in meta
- [ ] All args are meaningful and representative of real usage
- [ ] TypeScript types are correct — no `any`, uses `satisfies Meta<typeof Component>`

---

*Last updated: April 2026 — maintained by the Sturij platform team.*
