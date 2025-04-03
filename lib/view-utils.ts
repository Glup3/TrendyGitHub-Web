import { type viewSchema } from './schemas'
import { type z } from 'zod'

export type ViewType = z.infer<typeof viewSchema>
export type TableType = 'trend_daily' | 'trend_weekly' | 'trend_monthly'

// Map of view types to database table names
const VIEW_TABLE_MAP: Record<ViewType, TableType> = {
  daily: 'trend_daily',
  weekly: 'trend_weekly',
  monthly: 'trend_monthly',
}

// Map of view types to display text
const VIEW_TEXT_MAP: Record<ViewType, string> = {
  daily: 'today',
  weekly: 'this week',
  monthly: 'this month',
}

export function viewToTable(view: ViewType): TableType {
  return VIEW_TABLE_MAP[view] || 'trend_daily'
}

export function viewToText(view: ViewType): string {
  return VIEW_TEXT_MAP[view] || 'today'
} 