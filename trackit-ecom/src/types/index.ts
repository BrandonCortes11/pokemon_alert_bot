// Core types for TrackIt Ecom application

import { Database } from './database'

// Database table types
export type User = Database['public']['Tables']['users']['Row']
export type Business = Database['public']['Tables']['businesses']['Row'] 
export type Category = Database['public']['Tables']['categories']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type Revenue = Database['public']['Tables']['revenues']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ApiIntegration = Database['public']['Tables']['api_account_integrations']['Row']
export type ApprovalQueueItem = Database['public']['Tables']['api_approval_queue']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'] 
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
export type RevenueInsert = Database['public']['Tables']['revenues']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type BusinessUpdate = Database['public']['Tables']['businesses']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'] 
export type RevenueUpdate = Database['public']['Tables']['revenues']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

// Extended types with relationships
export interface ExpenseWithDetails extends Expense {
  category: Category
  business: Business
  product_associations?: Array<{
    product: Product
    allocated_amount?: string
  }>
}

export interface RevenueWithDetails extends Revenue {
  category: Category
  business: Business
  product_associations?: Array<{
    product: Product
    quantity?: number
    price_per_unit?: string
    line_item_total?: string
  }>
}

export interface BusinessWithStats extends Business {
  total_expenses?: string
  total_revenues?: string
  net_profit?: string
  profit_margin?: number
  category_count?: number
  product_count?: number
}

// UI/UX Types
export type Theme = 'light' | 'dark' | 'system'

export interface UserPreferences {
  theme: Theme
  default_currency: string
  default_date_range: string
  dashboard_layout?: {
    widgets: DashboardWidget[]
  }
  timezone?: string
  notifications?: {
    email: boolean
    push: boolean
    approval_reminders: boolean
  }
}

export interface DashboardWidget {
  id: string
  type: 'kpi' | 'chart' | 'table' | 'summary'
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  config: Record<string, any>
  visible: boolean
}

// Chart Data Types
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
  }>
}

export interface KPIMetrics {
  total_revenue: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  cash_flow: number
  customer_acquisition_cost?: number
}

// Form Types
export interface ExpenseFormData {
  amount: number
  description: string
  transaction_date: string
  category_id: string
  notes?: string
  tags?: string[]
  product_associations?: Array<{
    product_id: string
    allocated_amount?: number
  }>
}

export interface RevenueFormData {
  amount: number
  description: string
  transaction_date: string
  category_id: string
  is_discount_applied?: boolean
  discount_amount?: number
  is_refund_processed?: boolean
  refund_amount?: number
  notes?: string
  tags?: string[]
  product_associations?: Array<{
    product_id: string
    quantity?: number
    price_per_unit?: number
  }>
}

export interface BusinessFormData {
  name: string
  currency: string
}

export interface CategoryFormData {
  name: string
  type: 'Expense' | 'Revenue'
  business_id?: string
}

export interface ProductFormData {
  name: string
  sku?: string
  cost_of_goods_sold?: number
  selling_price?: number
  description?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Report Types
export interface DateRange {
  start_date: string
  end_date: string
}

export interface ReportFilters {
  business_id?: string
  category_ids?: string[]
  product_ids?: string[]
  date_range: DateRange
  source?: string[]
}

export interface ProfitLossReport {
  total_revenue: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  revenue_by_category: Array<{
    category: string
    amount: number
  }>
  expenses_by_category: Array<{
    category: string
    amount: number
  }>
  period: DateRange
}

export interface CashFlowReport {
  cash_inflows: Array<{
    date: string
    amount: number
  }>
  cash_outflows: Array<{
    date: string
    amount: number
  }>
  net_cash_flow: Array<{
    date: string
    amount: number
  }>
  period: DateRange
}

export interface ProductProfitabilityReport {
  products: Array<{
    product: Product
    revenue: number
    expenses: number
    profit: number
    profit_margin: number
  }>
  period: DateRange
}

// Integration Types
export type PlatformType = 
  | 'Facebook' 
  | 'Instagram' 
  | 'WhatsApp' 
  | 'Shopify' 
  | 'Stripe' 
  | 'QuickBooks'
  | 'Google_Ads'
  | 'TikTok_Ads' 
  | 'ShipStation'
  | 'Other'

export type IntegrationStatus = 
  | 'Connected' 
  | 'Disconnected' 
  | 'Expired' 
  | 'Error' 
  | 'Pending'

export interface IntegrationConfig {
  platform: PlatformType
  credentials: Record<string, string>
  settings: Record<string, any>
  sync_frequency?: 'hourly' | 'daily' | 'weekly'
  auto_approve?: boolean
}

// Approval Queue Types
export type ApprovalAction = 
  | 'approve' 
  | 'edit' 
  | 'reject' 
  | 'flag' 
  | 'merge'

export interface ApprovalActionData {
  action: ApprovalAction
  approval_id: string
  edited_data?: Partial<ExpenseFormData | RevenueFormData>
  notes?: string
  merge_with_id?: string
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Loading States
export interface LoadingState {
  isLoading: boolean
  loadingText?: string
  progress?: number
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
}