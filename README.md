# NHR Dashboard

Medical-insurance document-review analytics dashboard built with React 19, Vite 8, Recharts 3, and shadcn/ui. The app surfaces coder performance, change-type breakdowns, hospital reactions, and worksheet trends across configurable date ranges.

**Live site:** <https://johnnaumann.github.io/nhr/>

## Local development

```bash
npm install
npm run dev        # Vite dev server at localhost:5173
npm run build      # Type-check + production build
npm run preview    # Serve the production build locally
npm run lint       # ESLint
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 8 with `@tailwindcss/vite` |
| Styling | Tailwind CSS 4, CSS variables for theming (light/dark via `next-themes`) |
| Charts | Recharts 3 |
| Tables | TanStack Table 8, dnd-kit for row reordering |
| Components | shadcn/ui (Radix primitives), Lucide icons |
| Routing | react-router-dom 7 |
| Dates | date-fns 4, react-day-picker 9 |
| Validation | Zod 4 |

## Project structure

```
src/
  main.tsx                      App entry: BrowserRouter, providers, mounts <App>
  App.tsx                       Route definitions (/ -> login, /dashboard)
  index.css                     Global styles, CSS custom properties, chart palette

  pages/
    dashboard-page.tsx          Main dashboard composition

  components/
    site-header.tsx             Sticky header (title, theme toggle, sidebar trigger)
    dashboard-date-range-toolbar.tsx   Sticky toolbar: date range + global site toggles
    dashboard-institution-toggle.tsx   LICH / LTH / NYU / WTH multi-select (shared UI)
    section-cards.tsx            Overview stat cards (top of dashboard)
    chart-area-interactive.tsx   "Worksheets changed" line + pie chart
    chart-section.tsx            "Types of Changes" stacked bar + pie
    chart-required-changes.tsx   "Impact by site" stacked bar + "Hospital reactions" horizontal bar
    chart-coder-performance.tsx  "Coder Performance" bar + line + pie
    data-table.tsx               Document table with tabs, drawer detail, and area chart
    app-sidebar.tsx              Collapsible sidebar navigation
    login-form.tsx               Login screen form

    ui/                          Shared UI primitives (shadcn/ui + custom)
      chart.tsx                  ChartContainer, ChartTooltip, ChartTooltipContent
      chart-legend-list.tsx      Reusable sortable toggle-legend panel
      chart-tooltip-value.tsx    "N unit (pct%)" tooltip formatter
      chart-empty-state.tsx      Centered placeholder for empty chart states
      ... (badge, button, card, select, tabs, drawer, etc.)

  lib/
    utils.ts                     cn() (clsx + tailwind-merge)
    chart-helpers.ts             scaleInt, parseIsoDate, toggleVisibleKey, buildPieInsight
    chart-layout.ts              Shared Tailwind class tokens for chart panels
    dashboard-demo-range.ts      Date-range helpers and demo scale reference
    dashboard-institutions.ts    Institution keys, chart config, site short-code map

  contexts/
    dashboard-date-range-context.tsx   Date-range state + useDashboardDateRange
    dashboard-institutions-context.tsx   Visible sites (LICH, LTH, NYU, WTH) + useDashboardInstitutions

  hooks/
    use-mobile.ts                Viewport breakpoint hook

  app/dashboard/
    data.json                    Demo data for the document table
```

## Institution (site) filter

Hospital sites **LICH**, **LTH**, **NYU**, and **WTH** are controlled in one shared React context (`DashboardInstitutionsProvider` on the dashboard). The multi-select lives only in the **sticky reporting toolbar** next to the date range (labelled “Reporting period & sites”). **Worksheets changed** and **What most impacted the change** read that filter but do not duplicate the control.

Charts that respect the filter:

- **Worksheets changed** — line and pie series per institution.
- **What most impacted the change** — stacked bars by site; reaction totals scale with the number of selected sites (demo behaviour).

At least one site must stay selected (empty selection is ignored).

## Chart architecture

All four chart components follow the same structural pattern:

```
<Card @container/…>
  <CardHeader pt-2>
    <CardTitle> + <CardDescription> (responsive long/short via container queries)
  </CardHeader>
  <CardContent className={chartContentClass}>
    <section> (one per chart group)
      [filter toolbar]  (filterToolbarClass + dashed-underline Selects)
      <grid>
        [legend panel]  (<ChartLegendList> in legendPanelClass wrapper)
        [chart panel]   (ChartContainer in chartPanelClass wrapper)
        [pie panel]     (optional, with pieInsightClass summary)
      </grid>
    </section>
  </CardContent>
</Card>
```

### Shared modules

| Module | What it provides |
|--------|-----------------|
| `chart-helpers.ts` | `scaleInt` (scale demo integers by date-range factor), `parseIsoDate` (safe local-date parse), `toggleVisibleKey` (toggle a key in a visibility array preserving canonical order), `buildPieInsight` (generate narrative text from pie breakdown with customisable copy) |
| `chart-layout.ts` | `chartPanelClass`, `legendPanelClass`, `filterToolbarClass`, `filterSelectTriggerClass`, `chartContentClass`, `pieInsightClass` -- all the recurring Tailwind class strings so they stay in sync |
| `chart-legend-list.tsx` | `<ChartLegendList>` -- sortable multi-select legend with radio toggles, badges, and dimmed-off state |
| `chart-tooltip-value.tsx` | `<ChartTooltipValue>` -- "123 changes (45.6%)" formatter for pie/bar tooltips |
| `chart-empty-state.tsx` | `<ChartEmptyState>` -- centered placeholder with `chart`, `chart-tall`, and `pie` sizing variants |

### Date range and demo scaling

The dashboard uses a global date-range context (`DashboardDateRangeProvider`). All charts read from `useDashboardDateRange()` and scale their demo data proportionally via `scaleInt(base, rangeDays / referenceDays)` so shorter/longer periods produce visually proportional values.

### Chart colour palette

Eight chart colours are defined as CSS custom properties (`--chart-1` through `--chart-8`) in `index.css` for both light and dark themes. Grey (`--muted`) is reserved for neutral states like "no decision."

## Deployment

Pushes to `main` trigger `.github/workflows/deploy-pages.yml` which builds and publishes `dist/` to GitHub Pages. The Vite `base` is set from `GITHUB_PAGES_BASE_PATH` at build time.
