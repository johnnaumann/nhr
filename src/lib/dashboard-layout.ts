/**
 * Shared rhythm for the dashboard main column: stats row, chart cards, and
 * table blocks should share the same horizontal gutter and grid gaps.
 */

/** Page column horizontal inset (toolbar, stats grid, charts, table). */
export const dashboardMainGutterClass = "px-4 lg:px-6"

/**
 * Vertical gap between stacked sections (toolbar → stats → each chart card).
 * Matches multi-column grid gutters so spacing reads as one grid.
 */
export const dashboardSectionStackClass = "gap-4 md:gap-6"

/** Gap for CSS grids (stats row, chart panel columns, chart sub-sections). */
export const dashboardGridGapClass = "gap-4 md:gap-6"
