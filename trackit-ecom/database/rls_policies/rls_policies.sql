-- Row Level Security (RLS) Policies for TrackIt Ecom
-- Ensures users can only access and modify data belonging to their user_id or associated business_id

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_product_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_product_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_account_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_data_ingestion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_approval_queue ENABLE ROW LEVEL SECURITY;

-- 1. Users table policies
-- Users can only access and modify their own user record
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Businesses table policies  
-- Users can only access businesses they own
CREATE POLICY "Users can view own businesses" ON businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own businesses" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses" ON businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses" ON businesses
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Categories table policies
-- Users can access system categories (business_id IS NULL) and categories for their businesses
CREATE POLICY "Users can view relevant categories" ON categories
    FOR SELECT USING (
        business_id IS NULL OR 
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert categories for own businesses" ON categories
    FOR INSERT WITH CHECK (
        business_id IS NULL OR 
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update categories for own businesses" ON categories
    FOR UPDATE USING (
        business_id IS NULL OR 
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete custom categories for own businesses" ON categories
    FOR DELETE USING (
        is_custom = TRUE AND
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 4. Expenses table policies
-- Users can only access expenses for their businesses
CREATE POLICY "Users can view expenses for own businesses" ON expenses
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert expenses for own businesses" ON expenses
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update expenses for own businesses" ON expenses
    FOR UPDATE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete expenses for own businesses" ON expenses
    FOR DELETE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 5. Revenues table policies
-- Users can only access revenues for their businesses
CREATE POLICY "Users can view revenues for own businesses" ON revenues
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert revenues for own businesses" ON revenues
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update revenues for own businesses" ON revenues
    FOR UPDATE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete revenues for own businesses" ON revenues
    FOR DELETE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 6. Products table policies
-- Users can only access products for their businesses
CREATE POLICY "Users can view products for own businesses" ON products
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert products for own businesses" ON products
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update products for own businesses" ON products
    FOR UPDATE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete products for own businesses" ON products
    FOR DELETE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

-- 7. Expense Product Associations table policies
-- Users can only access associations for expenses they own
CREATE POLICY "Users can view expense product associations for own expenses" ON expense_product_associations
    FOR SELECT USING (
        expense_id IN (
            SELECT expense_id FROM expenses 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert expense product associations for own expenses" ON expense_product_associations
    FOR INSERT WITH CHECK (
        expense_id IN (
            SELECT expense_id FROM expenses 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        ) AND
        product_id IN (
            SELECT product_id FROM products 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update expense product associations for own expenses" ON expense_product_associations
    FOR UPDATE USING (
        expense_id IN (
            SELECT expense_id FROM expenses 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete expense product associations for own expenses" ON expense_product_associations
    FOR DELETE USING (
        expense_id IN (
            SELECT expense_id FROM expenses 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

-- 8. Revenue Product Associations table policies  
-- Users can only access associations for revenues they own
CREATE POLICY "Users can view revenue product associations for own revenues" ON revenue_product_associations
    FOR SELECT USING (
        revenue_id IN (
            SELECT revenue_id FROM revenues 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert revenue product associations for own revenues" ON revenue_product_associations
    FOR INSERT WITH CHECK (
        revenue_id IN (
            SELECT revenue_id FROM revenues 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        ) AND
        product_id IN (
            SELECT product_id FROM products 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update revenue product associations for own revenues" ON revenue_product_associations
    FOR UPDATE USING (
        revenue_id IN (
            SELECT revenue_id FROM revenues 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete revenue product associations for own revenues" ON revenue_product_associations
    FOR DELETE USING (
        revenue_id IN (
            SELECT revenue_id FROM revenues 
            WHERE business_id IN (
                SELECT business_id FROM businesses WHERE user_id = auth.uid()
            )
        )
    );

-- 9. API Account Integrations table policies
-- Users can only access their own integrations
CREATE POLICY "Users can view own API integrations" ON api_account_integrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API integrations" ON api_account_integrations
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        (business_id IS NULL OR 
         business_id IN (
             SELECT business_id FROM businesses WHERE user_id = auth.uid()
         ))
    );

CREATE POLICY "Users can update own API integrations" ON api_account_integrations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API integrations" ON api_account_integrations
    FOR DELETE USING (auth.uid() = user_id);

-- 10. API Data Ingestion Logs table policies
-- Users can only access logs for their integrations
CREATE POLICY "Users can view logs for own integrations" ON api_data_ingestion_logs
    FOR SELECT USING (
        integration_id IN (
            SELECT integration_id FROM api_account_integrations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert logs for own integrations" ON api_data_ingestion_logs
    FOR INSERT WITH CHECK (
        integration_id IN (
            SELECT integration_id FROM api_account_integrations WHERE user_id = auth.uid()
        )
    );

-- 11. API Approval Queue table policies
-- Users can only access approval items for their businesses
CREATE POLICY "Users can view approval queue for own businesses" ON api_approval_queue
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert approval queue items for own businesses" ON api_approval_queue
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update approval queue for own businesses" ON api_approval_queue
    FOR UPDATE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete approval queue for own businesses" ON api_approval_queue
    FOR DELETE USING (
        business_id IN (
            SELECT business_id FROM businesses WHERE user_id = auth.uid()
        )
    );