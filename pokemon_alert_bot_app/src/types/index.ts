// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Store types
export interface Store {
  id: string;
  name: string;
  displayName: string;
  url: string;
  logoUrl?: string;
  isActive: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  sku?: string;
  url: string;
  imageUrl?: string;
  category: string;
  storeId: string;
  lastPrice?: number;
  currentStock: StockStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Alert types
export interface Alert {
  id: string;
  userId: string;
  productId: string;
  name: string;
  conditions: AlertConditions;
  notifications: NotificationSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AlertConditions {
  stockStatus?: StockStatus[];
  priceThreshold?: number;
  priceDirection?: 'above' | 'below';
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  webhook?: string;
  discord?: string;
}

// Stock and monitoring types
export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LIMITED_STOCK = 'LIMITED_STOCK',
  PREORDER = 'PREORDER',
  UNKNOWN = 'UNKNOWN'
}

export interface StockCheck {
  id: string;
  productId: string;
  status: StockStatus;
  price?: number;
  quantity?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Community report types
export interface CommunityReport {
  id: string;
  userId: string;
  productId: string;
  reportType: 'stock' | 'price' | 'error';
  data: {
    status?: StockStatus;
    price?: number;
    notes?: string;
  };
  verified: boolean;
  votes: number;
  createdAt: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}