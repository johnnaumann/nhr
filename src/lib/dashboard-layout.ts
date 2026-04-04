/**
 * Shared rhythm for the dashboard main column: stats row, chart cards, and
 * table blocks should share the same horizontal gutter and grid gaps.
 */

/** Page column horizontal inset (toolbar, stats grid, charts, table). */
export const dashboardMainGutterClass = "px-4 lg:px-6"

/**
 * Vertical gap between stacked sections (toolbar → stats → each chart card).
 * Slightly more air at `md+` between major blocks; column gutters use
 * {@link dashboardGridGapClass} (`gap-4`) to match card padding.
 */
export const dashboardSectionStackClass = "gap-4 md:gap-6"

/**
 * Same rhythm as {@link dashboardSectionStackClass}: flex gap between CardHeader
 * and CardBody on dashboard stat cards and chart cards.
 */
export const dashboardCardBlockGapClass = dashboardSectionStackClass

/**
 * Grid / flex gap between sibling columns or rows inside the main column.
 * Uses `gap-4` (16px) so it matches Card content inset (`p-4` / `px-4`) —
 * stat cards, line vs pie, and other chart panels align to the same rhythm.
 */
export const dashboardGridGapClass = "gap-4"
