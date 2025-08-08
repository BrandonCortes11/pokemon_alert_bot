-- TrackIt Ecom Initial Database Schema
-- Based on requirements.md Database Schema Design section

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for enums
CREATE TYPE category_type AS ENUM ('Expense', 'Revenue');
CREATE TYPE expense_source AS ENUM ('Manual', 'Facebook_Ads', 'Instagram_Ads', 'WhatsApp', 'Other_API');
CREATE TYPE revenue_source AS ENUM ('Manual', 'WhatsApp_Sales', 'Ecom_Platform', 'Payment_Gateway', 'Other_API');
CREATE TYPE platform_type AS ENUM ('Facebook', 'Instagram', 'WhatsApp', 'Shopify', 'Stripe', 'QuickBooks', 'Google_Ads', 'TikTok_Ads', 'ShipStation', 'Other');
CREATE TYPE integration_status AS ENUM ('Connected', 'Disconnected', 'Expired', 'Error', 'Pending');
CREATE TYPE sync_status AS ENUM ('Success', 'Partial_Success', 'Failure', 'Processing');
CREATE TYPE approval_source AS ENUM ('Facebook', 'Instagram', 'WhatsApp', 'Other_API');
CREATE TYPE approval_data_type AS ENUM ('Expense', 'Revenue');
CREATE TYPE approval_status AS ENUM ('Pending_Review', 'Approved', 'Edited', 'Rejected', 'Flagged_For_Review', 'Merged_Duplicate');

-- 1. Users table
-- Purpose: Stores user-specific settings and preferences
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Businesses table
-- Purpose: Represents individual e-commerce businesses managed by users
CREATE TABLE businesses (
    business_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Categories table
-- Purpose: Defines expense and revenue categories (system and custom)
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type category_type NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_category_per_business UNIQUE (business_id, name, type)
);

-- 4. Expenses table
-- Purpose: Stores detailed records of all business expenses
CREATE TABLE expenses (
    expense_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    amount NUMERIC(18, 4) NOT NULL,
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    source expense_source NOT NULL,
    source_ref_id TEXT,
    approval_id UUID, -- Will be added as FK later
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Revenues table
-- Purpose: Stores detailed records of all business income and sales revenue
CREATE TABLE revenues (
    revenue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    amount NUMERIC(18, 4) NOT NULL,
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    source revenue_source NOT NULL,
    source_ref_id TEXT,
    approval_id UUID, -- Will be added as FK later
    is_discount_applied BOOLEAN NOT NULL DEFAULT FALSE,
    discount_amount NUMERIC(18, 4),
    is_refund_processed BOOLEAN NOT NULL DEFAULT FALSE,
    refund_amount NUMERIC(18, 4),
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Products table
-- Purpose: Stores information about products for profitability analysis
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT,
    cost_of_goods_sold NUMERIC(18, 4),
    selling_price NUMERIC(18, 4),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_sku_per_business UNIQUE (business_id, sku)
);

-- 7. Expense Product Associations table (Junction table)
-- Purpose: Links expenses to specific products
CREATE TABLE expense_product_associations (
    association_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(expense_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    allocated_amount NUMERIC(18, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_expense_product UNIQUE (expense_id, product_id)
);

-- 8. Revenue Product Associations table (Junction table)
-- Purpose: Links revenue transactions to specific products
CREATE TABLE revenue_product_associations (
    association_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenue_id UUID NOT NULL REFERENCES revenues(revenue_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER,
    price_per_unit NUMERIC(18, 4),
    line_item_total NUMERIC(18, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_revenue_product UNIQUE (revenue_id, product_id)
);

-- 9. API Account Integrations table
-- Purpose: Stores details for connecting to external APIs
CREATE TABLE api_account_integrations (
    integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    account_identifier TEXT,
    access_token_encrypted TEXT NOT NULL,
    refresh_token_encrypted TEXT,
    token_expiry TIMESTAMP WITH TIME ZONE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    status integration_status NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 10. API Data Ingestion Logs table
-- Purpose: Logs details of automated data fetching processes
CREATE TABLE api_data_ingestion_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES api_account_integrations(integration_id) ON DELETE CASCADE,
    sync_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_end_time TIMESTAMP WITH TIME ZONE,
    status sync_status NOT NULL,
    records_fetched_count INTEGER NOT NULL DEFAULT 0,
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 11. API Approval Queue table
-- Purpose: Holds raw data fetched from APIs requiring user review
CREATE TABLE api_approval_queue (
    approval_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    source_platform approval_source NOT NULL,
    source_record_id TEXT NOT NULL,
    data_type approval_data_type NOT NULL,
    raw_data JSONB NOT NULL,
    proposed_amount NUMERIC(18, 4) NOT NULL,
    proposed_description TEXT NOT NULL,
    proposed_transaction_date DATE NOT NULL,
    proposed_category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    detected_issues TEXT[],
    status approval_status NOT NULL DEFAULT 'Pending_Review',
    reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    review_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_source_record UNIQUE (business_id, source_platform, source_record_id)
);

-- Now add the foreign key constraints to expenses and revenues tables for approval_id
ALTER TABLE expenses 
ADD CONSTRAINT expenses_approval_id_fkey 
FOREIGN KEY (approval_id) REFERENCES api_approval_queue(approval_id) ON DELETE SET NULL;

ALTER TABLE revenues 
ADD CONSTRAINT revenues_approval_id_fkey 
FOREIGN KEY (approval_id) REFERENCES api_approval_queue(approval_id) ON DELETE SET NULL;

-- Create indexes for performance optimization
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_categories_business_id ON categories(business_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_expenses_business_id ON expenses(business_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_transaction_date ON expenses(transaction_date);
CREATE INDEX idx_expenses_source ON expenses(source);
CREATE INDEX idx_revenues_business_id ON revenues(business_id);
CREATE INDEX idx_revenues_category_id ON revenues(category_id);
CREATE INDEX idx_revenues_transaction_date ON revenues(transaction_date);
CREATE INDEX idx_revenues_source ON revenues(source);
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_api_integrations_user_id ON api_account_integrations(user_id);
CREATE INDEX idx_api_integrations_business_id ON api_account_integrations(business_id);
CREATE INDEX idx_api_integrations_platform ON api_account_integrations(platform);
CREATE INDEX idx_api_integrations_status ON api_account_integrations(status);
CREATE INDEX idx_approval_queue_business_id ON api_approval_queue(business_id);
CREATE INDEX idx_approval_queue_status ON api_approval_queue(status);
CREATE INDEX idx_approval_queue_source_platform ON api_approval_queue(source_platform);

-- Insert default system categories
-- Default Expense Categories
INSERT INTO categories (business_id, name, type, is_custom) VALUES
(NULL, 'Advertising', 'Expense', FALSE),
(NULL, 'Product Costs', 'Expense', FALSE),
(NULL, 'Shipping', 'Expense', FALSE),
(NULL, 'Transaction Fees', 'Expense', FALSE),
(NULL, 'Software Subscriptions', 'Expense', FALSE),
(NULL, 'Packaging', 'Expense', FALSE),
(NULL, 'Returns & Refunds', 'Expense', FALSE),
(NULL, 'Other', 'Expense', FALSE);

-- Default Revenue Categories
INSERT INTO categories (business_id, name, type, is_custom) VALUES
(NULL, 'Sales', 'Revenue', FALSE),
(NULL, 'Refunds', 'Revenue', FALSE),
(NULL, 'Other Income', 'Revenue', FALSE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON revenues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_integrations_updated_at BEFORE UPDATE ON api_account_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_queue_updated_at BEFORE UPDATE ON api_approval_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();