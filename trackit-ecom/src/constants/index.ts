// Application-wide constants for TrackIt Ecom

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  BUSINESSES: '/api/businesses',
  EXPENSES: '/api/expenses', 
  REVENUES: '/api/revenues',
  CATEGORIES: '/api/categories',
  PRODUCTS: '/api/products',
  INTEGRATIONS: '/api/integrations',
  REPORTS: '/api/reports',
  APPROVAL_QUEUE: '/api/approval-queue',
} as const;

// Platform Names
export const PLATFORM_NAMES = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram', 
  WHATSAPP: 'WhatsApp',
  SHOPIFY: 'Shopify',
  STRIPE: 'Stripe',
  QUICKBOOKS: 'QuickBooks',
  GOOGLE_ADS: 'Google_Ads',
  TIKTOK_ADS: 'TikTok_Ads',
  SHIPSTATION: 'ShipStation',
  OTHER: 'Other',
} as const;

// Expense Categories (Default System)
export const DEFAULT_EXPENSE_CATEGORIES = [
  'Advertising',
  'Product Costs', 
  'Shipping',
  'Transaction Fees',
  'Software Subscriptions',
  'Packaging',
  'Returns & Refunds',
  'Other',
] as const;

// Revenue Categories (Default System) 
export const DEFAULT_REVENUE_CATEGORIES = [
  'Sales',
  'Refunds',
  'Other Income',
] as const;

// Report Types
export const REPORT_TYPES = {
  PROFIT_AND_LOSS: 'profit_and_loss',
  CASH_FLOW: 'cash_flow',
  EXPENSE_BREAKDOWN: 'expense_breakdown',
  SALES_TRENDS: 'sales_trends',
  PRODUCT_PROFITABILITY: 'product_profitability',
  CUSTOMER_ACQUISITION_COSTS: 'customer_acquisition_costs',
} as const;

// Data Sources
export const DATA_SOURCES = {
  MANUAL: 'Manual',
  FACEBOOK_ADS: 'Facebook_Ads',
  INSTAGRAM_ADS: 'Instagram_Ads', 
  WHATSAPP: 'WhatsApp',
  WHATSAPP_SALES: 'WhatsApp_Sales',
  ECOM_PLATFORM: 'Ecom_Platform',
  PAYMENT_GATEWAY: 'Payment_Gateway',
  OTHER_API: 'Other_API',
} as const;

// Integration Status
export const INTEGRATION_STATUS = {
  CONNECTED: 'Connected',
  DISCONNECTED: 'Disconnected',
  EXPIRED: 'Expired',
  ERROR: 'Error',
  PENDING: 'Pending',
} as const;

// Approval Status
export const APPROVAL_STATUS = {
  PENDING_REVIEW: 'Pending_Review',
  APPROVED: 'Approved',
  EDITED: 'Edited',
  REJECTED: 'Rejected',
  FLAGGED_FOR_REVIEW: 'Flagged_For_Review',
  MERGED_DUPLICATE: 'Merged_Duplicate',
} as const;

// Date Ranges
export const DATE_RANGES = {
  TODAY: 'today',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days', 
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  THIS_YEAR: 'this_year',
  ALL_TIME: 'all_time',
  CUSTOM: 'custom',
} as const;

// Currencies
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  API_INTEGRATION: 'Failed to connect to external service.',
  DUPLICATE_ENTRY: 'This entry already exists.',
  REQUIRED_FIELD: 'This field is required.',
} as const;

// Success Messages  
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
  SAVED: 'Successfully saved!',
  CONNECTED: 'Successfully connected!',
  SYNC_COMPLETE: 'Data sync completed!',
} as const;

// Theme Settings
export const THEME_SETTINGS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Performance Settings
export const PERFORMANCE = {
  DASHBOARD_LOAD_TIME_TARGET: 3000, // 3 seconds
  REPORT_LOAD_TIME_TARGET: 5000, // 5 seconds
  API_TIMEOUT: 10000, // 10 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  PAGE_SIZE: 20,
} as const;