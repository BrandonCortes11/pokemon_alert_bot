export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          preferences: Json | null
          created_at: string
        }
        Insert: {
          id: string
          preferences?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          preferences?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          business_id: string
          user_id: string
          name: string
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          business_id?: string
          user_id: string
          name: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          user_id?: string
          name?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          category_id: string
          business_id: string | null
          name: string
          type: 'Expense' | 'Revenue'
          is_custom: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          category_id?: string
          business_id?: string | null
          name: string
          type: 'Expense' | 'Revenue'
          is_custom?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          business_id?: string | null
          name?: string
          type?: 'Expense' | 'Revenue'
          is_custom?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["business_id"]
          }
        ]
      }
      expenses: {
        Row: {
          expense_id: string
          business_id: string
          category_id: string
          amount: string
          description: string
          transaction_date: string
          source: 'Manual' | 'Facebook_Ads' | 'Instagram_Ads' | 'WhatsApp' | 'Other_API'
          source_ref_id: string | null
          approval_id: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          expense_id?: string
          business_id: string
          category_id: string
          amount: string
          description: string
          transaction_date: string
          source: 'Manual' | 'Facebook_Ads' | 'Instagram_Ads' | 'WhatsApp' | 'Other_API'
          source_ref_id?: string | null
          approval_id?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          expense_id?: string
          business_id?: string
          category_id?: string
          amount?: string
          description?: string
          transaction_date?: string
          source?: 'Manual' | 'Facebook_Ads' | 'Instagram_Ads' | 'WhatsApp' | 'Other_API'
          source_ref_id?: string | null
          approval_id?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "expenses_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "api_approval_queue"
            referencedColumns: ["approval_id"]
          }
        ]
      }
      revenues: {
        Row: {
          revenue_id: string
          business_id: string
          category_id: string
          amount: string
          description: string
          transaction_date: string
          source: 'Manual' | 'WhatsApp_Sales' | 'Ecom_Platform' | 'Payment_Gateway' | 'Other_API'
          source_ref_id: string | null
          approval_id: string | null
          is_discount_applied: boolean
          discount_amount: string | null
          is_refund_processed: boolean
          refund_amount: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          revenue_id?: string
          business_id: string
          category_id: string
          amount: string
          description: string
          transaction_date: string
          source: 'Manual' | 'WhatsApp_Sales' | 'Ecom_Platform' | 'Payment_Gateway' | 'Other_API'
          source_ref_id?: string | null
          approval_id?: string | null
          is_discount_applied?: boolean
          discount_amount?: string | null
          is_refund_processed?: boolean
          refund_amount?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          revenue_id?: string
          business_id?: string
          category_id?: string
          amount?: string
          description?: string
          transaction_date?: string
          source?: 'Manual' | 'WhatsApp_Sales' | 'Ecom_Platform' | 'Payment_Gateway' | 'Other_API'
          source_ref_id?: string | null
          approval_id?: string | null
          is_discount_applied?: boolean
          discount_amount?: string | null
          is_refund_processed?: boolean
          refund_amount?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenues_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "revenues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "revenues_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "api_approval_queue"
            referencedColumns: ["approval_id"]
          }
        ]
      }
      products: {
        Row: {
          product_id: string
          business_id: string
          name: string
          sku: string | null
          cost_of_goods_sold: string | null
          selling_price: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          product_id?: string
          business_id: string
          name: string
          sku?: string | null
          cost_of_goods_sold?: string | null
          selling_price?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          product_id?: string
          business_id?: string
          name?: string
          sku?: string | null
          cost_of_goods_sold?: string | null
          selling_price?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["business_id"]
          }
        ]
      }
      expense_product_associations: {
        Row: {
          association_id: string
          expense_id: string
          product_id: string
          allocated_amount: string | null
          created_at: string
        }
        Insert: {
          association_id?: string
          expense_id: string
          product_id: string
          allocated_amount?: string | null
          created_at?: string
        }
        Update: {
          association_id?: string
          expense_id?: string
          product_id?: string
          allocated_amount?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_product_associations_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["expense_id"]
          },
          {
            foreignKeyName: "expense_product_associations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          }
        ]
      }
      revenue_product_associations: {
        Row: {
          association_id: string
          revenue_id: string
          product_id: string
          quantity: number | null
          price_per_unit: string | null
          line_item_total: string | null
          created_at: string
        }
        Insert: {
          association_id?: string
          revenue_id: string
          product_id: string
          quantity?: number | null
          price_per_unit?: string | null
          line_item_total?: string | null
          created_at?: string
        }
        Update: {
          association_id?: string
          revenue_id?: string
          product_id?: string
          quantity?: number | null
          price_per_unit?: string | null
          line_item_total?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_product_associations_revenue_id_fkey"
            columns: ["revenue_id"]
            isOneToOne: false
            referencedRelation: "revenues"
            referencedColumns: ["revenue_id"]
          },
          {
            foreignKeyName: "revenue_product_associations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          }
        ]
      }
      api_account_integrations: {
        Row: {
          integration_id: string
          user_id: string
          business_id: string | null
          platform: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Shopify' | 'Stripe' | 'QuickBooks' | 'Google_Ads' | 'TikTok_Ads' | 'ShipStation' | 'Other'
          account_identifier: string | null
          access_token_encrypted: string
          refresh_token_encrypted: string | null
          token_expiry: string | null
          last_sync_at: string | null
          status: 'Connected' | 'Disconnected' | 'Expired' | 'Error' | 'Pending'
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          integration_id?: string
          user_id: string
          business_id?: string | null
          platform: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Shopify' | 'Stripe' | 'QuickBooks' | 'Google_Ads' | 'TikTok_Ads' | 'ShipStation' | 'Other'
          account_identifier?: string | null
          access_token_encrypted: string
          refresh_token_encrypted?: string | null
          token_expiry?: string | null
          last_sync_at?: string | null
          status: 'Connected' | 'Disconnected' | 'Expired' | 'Error' | 'Pending'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          integration_id?: string
          user_id?: string
          business_id?: string | null
          platform?: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Shopify' | 'Stripe' | 'QuickBooks' | 'Google_Ads' | 'TikTok_Ads' | 'ShipStation' | 'Other'
          account_identifier?: string | null
          access_token_encrypted?: string
          refresh_token_encrypted?: string | null
          token_expiry?: string | null
          last_sync_at?: string | null
          status?: 'Connected' | 'Disconnected' | 'Expired' | 'Error' | 'Pending'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_account_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_account_integrations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["business_id"]
          }
        ]
      }
      api_data_ingestion_logs: {
        Row: {
          log_id: string
          integration_id: string
          sync_start_time: string
          sync_end_time: string | null
          status: 'Success' | 'Partial_Success' | 'Failure' | 'Processing'
          records_fetched_count: number
          error_details: Json | null
          created_at: string
        }
        Insert: {
          log_id?: string
          integration_id: string
          sync_start_time: string
          sync_end_time?: string | null
          status: 'Success' | 'Partial_Success' | 'Failure' | 'Processing'
          records_fetched_count?: number
          error_details?: Json | null
          created_at?: string
        }
        Update: {
          log_id?: string
          integration_id?: string
          sync_start_time?: string
          sync_end_time?: string | null
          status?: 'Success' | 'Partial_Success' | 'Failure' | 'Processing'
          records_fetched_count?: number
          error_details?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_data_ingestion_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_account_integrations"
            referencedColumns: ["integration_id"]
          }
        ]
      }
      api_approval_queue: {
        Row: {
          approval_id: string
          business_id: string
          source_platform: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Other_API'
          source_record_id: string
          data_type: 'Expense' | 'Revenue'
          raw_data: Json
          proposed_amount: string
          proposed_description: string
          proposed_transaction_date: string
          proposed_category_id: string | null
          detected_issues: string[] | null
          status: 'Pending_Review' | 'Approved' | 'Edited' | 'Rejected' | 'Flagged_For_Review' | 'Merged_Duplicate'
          reviewed_by_user_id: string | null
          review_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          approval_id?: string
          business_id: string
          source_platform: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Other_API'
          source_record_id: string
          data_type: 'Expense' | 'Revenue'
          raw_data: Json
          proposed_amount: string
          proposed_description: string
          proposed_transaction_date: string
          proposed_category_id?: string | null
          detected_issues?: string[] | null
          status?: 'Pending_Review' | 'Approved' | 'Edited' | 'Rejected' | 'Flagged_For_Review' | 'Merged_Duplicate'
          reviewed_by_user_id?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          approval_id?: string
          business_id?: string
          source_platform?: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Other_API'
          source_record_id?: string
          data_type?: 'Expense' | 'Revenue'
          raw_data?: Json
          proposed_amount?: string
          proposed_description?: string
          proposed_transaction_date?: string
          proposed_category_id?: string | null
          detected_issues?: string[] | null
          status?: 'Pending_Review' | 'Approved' | 'Edited' | 'Rejected' | 'Flagged_For_Review' | 'Merged_Duplicate'
          reviewed_by_user_id?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_approval_queue_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "api_approval_queue_proposed_category_id_fkey"
            columns: ["proposed_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "api_approval_queue_reviewed_by_user_id_fkey"
            columns: ["reviewed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}