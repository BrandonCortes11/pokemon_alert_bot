# TrackIt Ecom Requirements

## Project Description
An expense and profit tracking app designed for e-commerce business owners. The app automates the process of tracking expenses and profits by integrating API calls from WhatsApp, Facebook, and Instagram. These API calls should be fully automated, requiring minimal user intervention—users simply approve the fetched data. The app also provides a user-friendly interface for manually inputting expenses and tracking them over time. Highlight key features such as automation, integration with social media platforms, manual data entry, and real-time reporting. Emphasize how this tool simplifies financial management and helps e-commerce entrepreneurs keep a clear overview of their financial health.

## Product Requirements Document
TrackIt Ecom Product Requirements Document (PRD)

1. Introduction
TrackIt Ecom is an innovative expense and profit tracking application specifically designed for e-commerce business owners. The core objective of this application is to automate and simplify financial management by intelligently integrating with popular social media platforms such as WhatsApp, Facebook, and Instagram. By leveraging API calls from these platforms, TrackIt Ecom aims to minimize manual data entry, allowing users to primarily review and approve automatically fetched financial data. The application will also provide a robust interface for manual input, real-time reporting, and customizable dashboards, empowering entrepreneurs with a clear and comprehensive overview of their financial health.

2. Goals & Objectives

2.1. Overall Goal
To simplify financial management for small to medium-sized e-commerce entrepreneurs by providing an automated, intuitive, and insightful tool for tracking expenses and profits.

2.2. Key Objectives
*   Automate the collection of expense and profit data directly from WhatsApp, Facebook, and Instagram APIs, requiring minimal user intervention.
*   Enable users to easily review, edit, categorize, and approve automatically fetched data to ensure accuracy.
*   Provide a user-friendly interface for manual entry of expenses and profits not captured via automation.
*   Offer real-time reporting and customizable dashboards to visualize key financial performance indicators (KPIs).
*   Correlate advertising spend and engagement data with sales data to accurately determine profit margins.
*   Minimize development costs by leveraging free-tier services and open-source tools where possible.
*   Deliver a secure and compliant platform for handling sensitive financial data.

3. Target Audience

3.1. Primary Users
Small to medium-sized e-commerce entrepreneurs, including sole proprietors and small teams managing online stores. This encompasses various business models such as dropshipping, product manufacturing, and online service providers.

3.2. User Characteristics
*   **Technical Proficiency:** Basic to moderate technical skills.
*   **Current Methods:** Often rely on manual financial tracking methods like spreadsheets or paper records.
*   **Needs:** Seek an easy-to-use, automated solution that reduces time-consuming manual entry, simplifies financial management, and integrates seamlessly with platforms they already use (WhatsApp, Facebook, Instagram).
*   **Goals:** Desire real-time financial insights without requiring advanced technical knowledge, aiming for better financial clarity and decision-making.

4. Key Features

4.1. Automated Data Fetching & Integration

4.1.1. Supported Platforms & APIs
*   **Facebook Graph API:** For ads data (spend, impressions, clicks, conversions), campaign/ad performance metrics, audience engagement insights, and purchase conversions tracked via Facebook Ads.
*   **Instagram Business API:** For engagement insights (likes, comments, shares), ad performance metrics (if ads run through FB/IG), and link clicks/conversions from Instagram posts/stories.
*   **WhatsApp Business API:** For conversation data to identify customer inquiries related to orders, order confirmations or requests shared via chat, and customer contact/transactional messages.

4.1.2. Data Points Captured (Automated)
*   **Expenses:**
    *   Advertising spend (e.g., Facebook, Instagram ads)
    *   Campaign IDs and associated ad performance metrics.
    *   Engagement metrics from Instagram to infer promotional costs.
*   **Profits/Revenue:**
    *   Number of clicks, conversions, and sales attributed to ads.
    *   Purchase conversions tracked via Facebook Ads.
    *   Customer order details or confirmations shared via WhatsApp chat.
    *   Inquiry-to-order conversion data from WhatsApp conversations.

4.1.3. Data Granularity
*   Expenses and revenues will be tracked at a transaction level for detailed insights.
*   Aggregated daily, weekly, and monthly summaries will be provided for overview reporting.
*   Product-specific analysis will be supported where applicable, categorizing expenses and profits per product.
*   Users will have flexibility to view data at various granularities (per transaction, daily, weekly, monthly).

4.2. Manual Data Entry

4.2.1. User Interface
A user-friendly interface for manually inputting expenses and profits.

4.2.2. Data Points Captured (Manual & Automated)
*   **Expenses:**
    *   Advertising spend
    *   Product costs (Cost of Goods Sold - COGS)
    *   Shipping and delivery expenses
    *   Transaction fees (e.g., PayPal, Stripe fees)
    *   Returns and refunds (as expense or negative revenue)
    *   Software subscriptions (e.g., e-commerce platforms, analytics tools)
    *   Packaging and handling costs
    *   Miscellaneous operating expenses
*   **Profits:**
    *   Sales revenue (total sales amount)
    *   Payment gateway payouts and splits
    *   Refunds processed (as negative revenue)
    *   Discounts and coupons applied (as negative revenue)

4.3. Automated Data Review & Management

4.3.1. Review Interface
The app will automatically fetch relevant expense and profit data from connected platforms and present it to users in a simple, intuitive review interface.

4.3.2. User Actions on Fetched Data
*   **Approve as is:** Confirm the data without changes, allowing it to be logged.
*   **Edit values:** Adjust incorrect or outdated data points (amounts, dates).
*   **Categorize:** Assign or reassign expense or income categories (e.g., marketing, product costs, shipping).
*   **Add notes or tags:** Include additional context or annotations for future reference.
*   **Reject or delete:** Remove incorrect or irrelevant data entries.
*   **Flag for review:** Mark certain data entries for additional verification or manual review later.

4.3.3. Conflict, Duplication, and Missing Information Handling
*   **Conflicts:** The system will alert users to discrepancies (e.g., differing amounts for the same transaction) and provide options to resolve them through editing or merging entries.
*   **Duplicates:** The app will detect potential duplicate entries based on matching amounts, dates, and descriptions, prompting users to merge or discard duplicates.
*   **Missing Information:** When data is incomplete (e.g., missing category or date), the app will either auto-fill common defaults or prompt the user to input missing details before approval.

4.4. Reporting & Dashboard

4.4.1. Real-time Reporting
Provides users with immediate insights into their financial status.

4.4.2. Key Performance Indicators (KPIs)
*   Total Revenue (current sales income)
*   Total Expenses (sum of all expenses categorized by type)
*   Profit and Loss (P&L) / Net Profit Margins (net profit after deducting expenses from revenue)
*   Profit Margin Percentage (ratio of profit to total revenue)
*   Cash Flow (inflows and outflows over a specific period)
*   Expense Breakdown by Category (visualization of spending distribution)
*   Sales Trends (daily, weekly, or monthly sales performance)
*   Product Profitability (profit margins per product or category)
*   Customer Acquisition Costs (expenses related to acquiring new customers)

4.4.3. Report Types & Visualizations
*   **Profit & Loss Statement:** Summarized view of income and expenses over time.
*   **Cash Flow Charts:** Visual representations of inflows and outflows.
*   **Expense Breakdown Pie Charts:** Showing proportions of different expense categories.
*   **Trend Analysis Graphs:** Line charts illustrating revenue and expenses over time.
*   **Product Profitability Tables:** Highlighting the most and least profitable products.

4.4.4. Interactivity
Dynamic and interactive visual tools enabling users to filter data by date ranges, categories, or products.

4.5. Customization Options

4.5.1. User Experience Personalization
*   **Dark Mode:** For comfortable viewing in various lighting conditions.
*   **Personalized Dashboards:** Allow rearranging widgets or selecting which KPIs are most prominent.
*   **Custom Categories:** For expenses and income, tailored to unique business structures.
*   **Report Preferences:** Ability to set custom date ranges and other report display preferences.

5. User Flows

5.1. Onboarding & Account Setup
1.  User signs up for a TrackIt Ecom account.
2.  User connects WhatsApp, Facebook, and Instagram Business accounts via secure API authorization (OAuth 2.0).
3.  User optionally sets up initial custom expense/income categories.

5.2. Automated Data Sync & Review
1.  App automatically fetches new expense and profit data from connected platforms at regular intervals.
2.  New data appears in a "Pending Review" section or similar.
3.  User navigates to the review section.
4.  For each entry, user reviews details, makes edits, assigns/changes category, adds notes, then approves, rejects, or flags for later review.
5.  System handles conflicts/duplicates by prompting user for resolution (merge/discard).
6.  Approved data is logged and reflected in reports.

5.3. Manual Data Entry
1.  User navigates to the "Add Entry" or "Manual Input" section.
2.  User selects whether it's an expense or profit.
3.  User fills in required data points (amount, date, description, category).
4.  User saves the entry.
5.  Entry is logged and reflected in reports.

5.4. Reporting & Insights Access
1.  User navigates to the "Dashboard" or "Reports" section.
2.  User views real-time KPIs and default visual reports.
3.  User applies filters (date range, category, product) to drill down into data.
4.  User generates and views specific reports (P&L, Cash Flow, Expense Breakdown, Product Profitability).
5.  User can customize dashboard layout and prominent KPIs.

6. Technical Requirements & Integrations

6.1. Backend & Database
*   **Database & Authentication:** Supabase will be leveraged for its robust database capabilities and secure user authentication (including multi-factor authentication and role-based access controls).
*   **Hosting:** Prioritize open-source or free-tier cloud services to minimize initial hosting costs.

6.2. API Integration Details
*   **Facebook & Instagram:**
    *   Utilize Facebook Graph API and Instagram Business API for ad spend, campaign IDs, clicks, conversions, sales attribution, and engagement metrics.
    *   OAuth 2.0 for secure user authorization.
*   **WhatsApp:**
    *   Utilize WhatsApp Business API for customer order details, confirmations, and inquiry-to-order conversion data from chat conversations.
    *   Focus on extracting structured or semi-structured data related to transactions.
*   **API Security:** Implement OAuth 2.0 for third-party integrations. Securely manage API keys and secrets, ensuring regular rotation to prevent unauthorized access.

6.3. Scalability & Performance
*   **User Load Estimates:**
    *   First 6 months: Approximately 500 to 1,000 active users.
    *   Within 1 year: 3,000 to 5,000 active users.
    *   Over 3 years: 15,000 to 30,000 active users.
*   **Performance Expectations:**
    *   **Data Fetching:** API calls and data retrieval should complete within 1-3 seconds for dashboards and key reports.
    *   **Report Generation:** Basic financial reports should generate within 2-5 seconds. Maximum acceptable load times for dashboards and reports should not exceed 5 seconds, even with sizable datasets.
    *   **Overall App Responsiveness:** The app must maintain a responsive interface with minimal lag when navigating between sections.
*   **Optimization:** Implement efficient database queries, caching strategies, and potentially incremental loading techniques to maintain performance at higher data volumes.

6.4. Security & Compliance
*   **Secure Data Storage:** Utilize Supabase's built-in encryption for data at rest and TLS protocols for data in transit.
*   **Authentication & Authorization:** Leverage Supabase Authentication for secure user login, multi-factor authentication (MFA), and role-based access controls (RBAC) to restrict data access appropriately.
*   **User Privacy and Consent:** Clearly inform users about data collection, processing, and storage practices. Obtain explicit consent, especially for sensitive and financial data.
*   **Compliance Requirements:**
    *   **GDPR:** Implement features for data access, correction, deletion, and data portability.
    *   **CCPA:** Provide clear options for users to opt out of data sharing and ensure transparency around data collection.
    *   **Local Financial Regulations:** Comply with relevant financial reporting and record-keeping rules applicable to the operating jurisdiction.
    *   **PCI DSS:** If handling payments directly, ensure compliance. (Note: Utilizing third-party payment processors like Stripe can offload PCI compliance burden).
*   **Security Audits:** Conduct periodic assessments of integrated systems, monitor activity logs (Supabase provides audit logs), and perform vulnerability scans.
*   **Data Minimization & Retention:** Collect only essential data and establish clear data retention policies aligned with legal requirements.

7. UX/UI Design Principles

7.1. Aesthetic Preferences
*   **Visual Style:** Clean, modern, and intuitive user interface.
*   **Focus:** Clarity and ease of use.
*   **Color Scheme:** Professional but approachable, preferably using calming colors like blues and grays, with accent colors for important alerts or highlights.
*   **Inspiration:** Apps such as QuickBooks and Xero (for their straightforward layouts and clear visualization of financial data), and Mint (for simplicity and user-friendly design).

7.2. Interaction Design
*   Minimize clicks and steps for common actions.
*   Provide clear visual feedback for user actions and system status.
*   Ensure data visualizations are easily digestible and interactive.

8. Future Enhancements (Roadmap)

8.1. Phase 2 Integrations
*   **E-commerce Platforms:** Shopify, WooCommerce, BigCommerce (direct synchronization of sales, inventory, and order data).
*   **Payment Gateways:** Stripe, PayPal, Square (automatic import of payout data, transaction details, and fees).
*   **Accounting Software:** QuickBooks, Xero, Wave (seamless synchronization of financial records).
*   **Advertising & Marketing Platforms:** Google Ads, TikTok Ads (broadening expense and performance tracking).
*   **Shipping & Logistics:** ShipStation, Easyship (tracking shipping costs and delivery statuses).

8.2. Architecture for Extensibility
The system architecture will be designed with a modular approach to allow these additional integrations to be added progressively, ensuring scalability and flexibility as the app evolves.

9. Timeline & Budget Constraints

9.1. Timeline
*   **MVP (Minimum Viable Product):** Approximately 3 to 4 months. This includes core expense/profit tracking, basic API integrations with WhatsApp, Facebook, and Instagram, and a simple UI for approval workflows and reporting.
*   **Full-Featured Release:** An additional 6 to 9 months post-MVP, contingent upon validation, user feedback, and growth. This phase will include advanced reporting, customizable dashboards, and additional integrations.

9.2. Budget Constraints
*   **Initial Investment:** Limited, focusing on bootstrapping the project with minimal expenditure.
*   **Resource Utilization:** Prioritize leveraging free or low-cost tools and services.
*   **Cloud Services:** Utilize open-source or free-tier cloud services to minimize hosting costs.
*   **Database/Auth:** Leverage existing platforms like Supabase for database and authentication, benefiting from their generous free plans.
*   **Feature Prioritization:** Features will be prioritized based on core value to avoid overextending resource constraints.
*   **Funding Milestones:** Future funding will be based on user onboarding metrics, early adoption, and positive feedback, justifying increased investment as the product proves its viability.

9.3. Resource Constraints
*   **Team:** Limited or no dedicated internal team; likely relying on solo development or minimal freelance assistance for MVP.
*   **Development Approach:** Agile, iterative approach to development, focusing first on essential features before expanding.

10. Assumptions & Constraints

10.1. Key Assumptions
*   The specific data points required for expense and profit tracking are consistently available via the identified APIs (Facebook Graph API, Instagram Business API, WhatsApp Business API).
*   The API structures and access policies of the integrated platforms will remain stable or provide sufficient notice for changes.
*   Users are willing to connect their social media accounts and approve data for automation.
*   Supabase will adequately support the application's database, authentication, and security requirements within its free/low-cost tiers for the initial phases.

10.2. Constraints
*   Limited initial budget necessitates a focus on core features and cost-effective technologies.
*   Dependence on third-party API availability and their respective rate limits.
*   Security and privacy regulations (GDPR, CCPA, local financial regulations) must be strictly adhered to.
*   No dedicated internal team for large-scale development or ongoing maintenance during the MVP phase.

## Technology Stack
## TECHSTACK: TrackIt Ecom

### 1. Overview

This document outlines the recommended technology stack for "TrackIt Ecom," an expense and profit tracking application designed for e-commerce business owners. The choices prioritize rapid MVP development (3-4 months), cost-effectiveness through free/low-cost tiers and open-source tools, robust security for sensitive financial data, a highly responsive and intuitive user experience, and a modular architecture for future extensibility and scalability up to 30,000 active users.

### 2. Core Principles Guiding Technology Choices

*   **Bootstrapping & Cost-Effectiveness**: Leverage free tiers, open-source software, and Backend-as-a-Service (BaaS) solutions to minimize initial investment and operational costs.
*   **Rapid MVP Development**: Select frameworks and tools that enable quick iteration and deployment of core features within the tight 3-4 month timeline.
*   **Scalability & Performance**: Choose technologies capable of handling growing data volumes and user bases (up to 30,000 users) while maintaining fast data fetching (1-3 seconds for dashboards) and report generation (2-5 seconds).
*   **Security & Compliance**: Prioritize solutions with built-in security features, robust authentication, and the ability to meet data privacy regulations (GDPR, CCPA).
*   **User Experience (UX) Focus**: Adopt technologies that facilitate building a clean, modern, intuitive, and customizable UI, aligning with the aesthetic preferences of QuickBooks, Xero, and Mint.
*   **Automation & Integration**: Enable seamless, automated API integrations with social media platforms (WhatsApp, Facebook, Instagram) with minimal user intervention.
*   **Extensibility**: Design a modular system that can easily integrate with future platforms (e-commerce, payment gateways, accounting software).

### 3. Frontend Technologies

The frontend focuses on delivering a highly customizable, performant, and user-friendly interface as envisioned.

*   **Framework**: **React (with Next.js)**
    *   **Justification**:
        *   **Developer Experience**: React's component-based architecture and vast ecosystem accelerate development, critical for the MVP timeline.
        *   **Performance**: Next.js provides server-side rendering (SSR) and static site generation (SSG) capabilities, ensuring fast initial page loads and improved overall responsiveness, even with complex dashboards.
        *   **Scalability**: Well-suited for single-page applications that can grow in complexity.
        *   **Community Support**: Large community ensures access to resources, libraries, and solutions.
        *   **Feature Alignment**: Supports building personalized dashboards, custom categories, and dark mode efficiently.
*   **Styling**: **Tailwind CSS**
    *   **Justification**:
        *   **Rapid UI Development**: Utility-first approach allows for extremely fast styling without writing custom CSS, aligning with rapid MVP development.
        *   **Customization**: Highly flexible and customizable to match specific brand guidelines, color schemes (calming blues/grays with accent colors), and aesthetic preferences.
        *   **Consistency**: Helps maintain a consistent design system across the application.
        *   **Performance**: Generates minimal CSS, contributing to faster load times.
*   **Charting & Data Visualization**: **Recharts or Nivo**
    *   **Justification**:
        *   **Interactive Visualizations**: Both are React-based libraries offering powerful and interactive charting components essential for "real-time reporting," "dynamic and interactive" dashboards (Profit & Loss, Cash Flow, Expense Breakdown, Sales Trends, Product Profitability).
        *   **Clarity**: Enable clear and concise visualization of financial data, akin to QuickBooks and Xero.
        *   **Performance**: Optimized for rendering complex charts efficiently, crucial for reports with "sizable datasets" and maintaining "minimal lag."

### 4. Backend & Database Technologies

The backend and database choices are centered around Supabase, fulfilling the "minimal investment" and "existing APIs and platforms like Supabase" requirements.

*   **Backend as a Service (BaaS) / Database**: **Supabase (PostgreSQL)**
    *   **Justification**:
        *   **Cost-Effective**: Offers a generous free tier, making it ideal for bootstrapping and minimizing initial budget constraints.
        *   **Integrated Platform**: Provides a comprehensive suite including a powerful PostgreSQL database, authentication, real-time capabilities, and serverless functions, simplifying the technology stack for a solo or minimal team.
        *   **PostgreSQL**: A robust, reliable, and highly scalable relational database capable of handling transactional data efficiently. It supports complex queries required for "transaction level" and "aggregated daily/weekly summaries," as well as "product-specific analysis."
        *   **Flexible Schema**: PostgreSQL's flexibility allows for custom categories for expenses/income, fulfilling a key customizability requirement.
        *   **Security**: Supabase natively provides "secure data storage" (encryption at rest, TLS for data in transit), "audit logs," and simplifies compliance efforts.
*   **Serverless Functions / API Integration Layer**: **Supabase Edge Functions (Deno)**
    *   **Justification**:
        *   **Secure API Handling**: Edge Functions run in a secure, isolated environment, ideal for managing and utilizing sensitive API keys for Facebook Graph API, Instagram Business API, and WhatsApp Business API.
        *   **Automated Data Fetching**: Can be scheduled to automatically fetch data regularly from connected platforms, minimizing user intervention.
        *   **Data Transformation & Validation**: Efficiently process, transform, and validate incoming data from various APIs to fit the PostgreSQL schema, handling conflicts, duplicates, and missing information as required.
        *   **Scalability**: Serverless nature allows automatic scaling to handle varying loads from API calls and data processing.
        *   **Ecosystem Alignment**: Seamlessly integrates with the Supabase database, providing a unified and efficient backend solution.

### 5. API Integrations

*   **Facebook Graph API**: For advertising spend, campaign performance, and purchase conversions.
*   **Instagram Business API**: For ad performance metrics and engagement insights.
*   **WhatsApp Business API**: For customer order details, confirmations, and inquiry-to-order conversion data from chat.
*   **Security Protocol**: **OAuth 2.0** for secure authorization and access to third-party platforms.
    *   **Justification**: Industry standard for secure delegated access, ensuring user consent and protecting API keys.

### 6. Authentication & Authorization

*   **Technology**: **Supabase Authentication (built-in)**
    *   **Justification**:
        *   **Secure User Login**: Provides robust email/password authentication with support for Multi-Factor Authentication (MFA).
        *   **Role-Based Access Control (RBAC)**: Utilizes PostgreSQL's Row-Level Security (RLS) to restrict data access based on user roles and ownership, ensuring high data privacy and security.
        *   **Ease of Use**: Integrates directly with the Supabase ecosystem, reducing development complexity and time.

### 7. Deployment & Hosting

*   **Frontend**: **Vercel**
    *   **Justification**:
        *   **Next.js Optimization**: Vercel is specifically optimized for Next.js applications, offering automatic deployments from Git repositories.
        *   **Global CDN**: Provides fast content delivery worldwide, contributing to "overall app responsiveness."
        *   **Free Tier**: Generous free tier suitable for initial bootstrapping.
*   **Backend & Database**: **Supabase Cloud**
    *   **Justification**: Directly hosts the PostgreSQL database, authentication service, and Edge Functions, aligning with the "free-tier cloud services" and "minimal investment" strategy.

### 8. DevOps & Developer Tools

*   **Version Control**: **Git / GitHub**
    *   **Justification**: Industry standard for source code management, collaboration, and tracking changes, essential for an iterative development approach.
*   **Integrated Development Environment (IDE)**: **Visual Studio Code (VS Code)**
    *   **Justification**: Lightweight, highly extensible, and popular IDE with excellent support for JavaScript, TypeScript, React, and Deno (for Edge Functions).
*   **Package Manager**: **NPM / Yarn**
    *   **Justification**: Standard tools for managing project dependencies.

### 9. Security & Compliance Practices

*   **Secure Data Storage**: Leveraging Supabase's encryption for data at rest and TLS protocols for data in transit.
*   **API Security**: OAuth 2.0 for all third-party integrations, secure management and regular rotation of API keys and secrets.
*   **User Privacy & Consent**: Explicit user consent mechanisms for data collection, processing, and storage, particularly for financial and sensitive information.
*   **Compliance Frameworks**:
    *   **GDPR & CCPA**: Implementation of features for data access, correction, deletion, and portability. Transparent data practices.
    *   **Local Financial Regulations**: Adherence to relevant financial reporting and record-keeping rules for the target jurisdiction.
    *   **PCI DSS**: Compliance responsibility for payment processing will be offloaded to third-party payment gateways (e.g., Stripe, PayPal), as the app will not directly handle credit card data.
*   **Regular Security Audits**: Periodic system assessments, vulnerability scans, and monitoring of activity logs (Supabase audit logs).
*   **Data Minimization & Retention**: Collect only essential data; establish clear retention policies aligned with legal requirements.

### 10. Future Extensibility (Post-MVP)

The modular design using React components, Supabase Edge Functions, and a PostgreSQL database will allow for seamless integration of future platforms, including:

*   **E-commerce Platforms**: Shopify, WooCommerce, BigCommerce (for sales, inventory, order data).
*   **Payment Gateways**: Stripe, PayPal, Square (for payout data, transaction details, fees).
*   **Accounting Software**: QuickBooks, Xero, Wave (for financial record synchronization).
*   **Advertising & Marketing**: Google Ads, TikTok Ads.
*   **Shipping & Logistics**: ShipStation, Easyship.

This chosen tech stack provides a robust, scalable, and cost-effective foundation for "TrackIt Ecom," enabling rapid development of an MVP and a clear path for future growth and feature expansion.

## Project Structure
This section outlines the logical and physical organization of the "TrackIt Ecom" project's codebase. The structure is designed to promote modularity, maintainability, scalability, and clear separation of concerns, facilitating both solo development and future team collaboration.

**1. Root Directory (`trackit-ecom/`)**

*   `.env`: Environment configuration file for local development. Stores sensitive information (API keys, database URLs) not committed to version control.
*   `.gitignore`: Specifies files and directories that Git should ignore.
*   `package.json`: Defines project metadata, scripts, and manages dependencies for both frontend and backend.
*   `package-lock.json`: Records the exact version of each dependency, ensuring consistent installations.
*   `README.md`: Provides a high-level overview of the project, setup instructions, and key features.
*   `LICENSE.md`: Specifies the project's licensing terms.
*   `CONTRIBUTING.md`: Guidelines for contributors who wish to contribute to the project.

**2. Source Code Directory (`src/`)**

Contains all the primary application source code, logically divided into `client` (frontend), `server` (backend), and `shared` for common assets and logic.

*   **`src/client/`**: The frontend React application.
    *   `public/`: Static assets served directly by the web server (e.g., `index.html`, `favicon.ico`).
    *   `src/`: Main React application source.
        *   `assets/`: Stores static assets such as images, icons, and fonts used in the UI.
        *   `components/`: Reusable UI components. Organized further for clarity and maintainability:
            *   `ui/`: Generic, atomic UI components (e.g., `Button.jsx`, `Input.jsx`, `Modal.jsx`, `Spinner.jsx`).
            *   `layout/`: Components defining the overall page structure (e.g., `Sidebar.jsx`, `Navbar.jsx`, `Footer.jsx`).
            *   `charts/`: Components specifically for data visualization (e.g., `LineChart.jsx`, `PieChart.jsx`, `BarChart.jsx`).
            *   `forms/`: Reusable form elements and input groups (e.g., `ExpenseForm.jsx`, `LoginForm.jsx`).
        *   `contexts/`: React Context API providers for managing global state. (e.g., `AuthContext.js` for user authentication state, `ThemeContext.js` for dark/light mode and branding guidelines).
        *   `hooks/`: Custom React hooks for encapsulating reusable logic and behavior (e.g., `useAuth.js` for authentication flow, `useDataFetch.js` for API data fetching with loading/error states).
        *   `pages/`: Top-level components representing distinct views or pages of the application. Each page orchestrates multiple components and handles page-specific logic (e.g., `Dashboard.jsx`, `ExpensesPage.jsx`, `ProfitsPage.jsx`, `ReportsPage.jsx`, `SettingsPage.jsx`, `AuthPage.jsx` for login/signup).
        *   `services/`: Client-side modules for interacting with the backend API and potentially external services. These abstract away direct API calls (e.g., `api.js` for an Axios instance, `authService.js` for client-side authentication logic).
        *   `styles/`: Global stylesheets and styling configurations.
            *   `index.css`: Main CSS file, often importing TailwindCSS or global styles, applying base typography and layout.
            *   `tailwind.config.js`: Tailwind CSS configuration file for customizing design tokens (colors, spacing, fonts) to align with brand guidelines.
            *   `theme.js`: Defines application-wide theme settings (e.g., color palette, typography, component styling variations) for consistency and customizability (e.g., dark mode settings).
        *   `utils/`: Client-side utility functions (e.g., `formatters.js` for date/currency formatting, `validators.js` for client-side input validation, `helpers.js` for general-purpose client functions).
        *   `App.jsx`: The root component of the React application, defining routing using React Router and top-level layout structure.
        *   `index.js`: The entry point for the React application, responsible for rendering the `App` component to the DOM.

*   **`src/server/`**: The Node.js/Express backend API.
    *   `config/`: Configuration settings for the server, external services, and environment variables.
        *   `env.js`: Utility for loading and validating environment variables, ensuring all necessary secrets and configurations are present.
        *   `supabase.config.js`: Supabase client initialization and configuration, setting up the connection to the database and authentication services.
    *   `controllers/`: Handle incoming HTTP requests, parse inputs, call appropriate services, and send responses. They act as the orchestration layer between routes and core business logic.
        *   `authController.js`: Manages user authentication (login, signup, password reset) and session management.
        *   `expenseController.js`: Handles all expense-related requests (create, read, update, delete expense entries).
        *   `profitController.js`: Handles profit and revenue-related requests.
        *   `reportController.js`: Manages requests for generating financial reports and dashboards.
        *   `integrationController.js`: Manages connecting, disconnecting, and configuring social media and e-commerce platform accounts.
    *   `middleware/`: Express middleware functions for request processing, executed before controller logic.
        *   `authMiddleware.js`: Verifies user authentication tokens (e.g., JWT from Supabase) and enforces role-based access control.
        *   `errorHandler.js`: Centralized error handling for the API, catching errors and sending standardized error responses.
        *   `validationMiddleware.js`: Validates request body, parameters, and query strings using schemas (e.g., Joi, Yup) to ensure data integrity.
    *   `models/`: Defines data models and direct interactions with the Supabase database. These functions abstract database queries and ensure data consistency.
        *   `expenseModel.js`: Database operations for expense entries.
        *   `profitModel.js`: Database operations for profit and revenue entries.
        *   `integrationModel.js`: Manages storage of user-specific API tokens and integration settings.
        *   `userModel.js`: User-related database operations (e.g., user profiles, settings).
    *   `routes/`: Defines API endpoints and links them to specific controller functions. Organizes routes by feature.
        *   `api.js`: Main API router, combining all feature-specific routes into a single entry point.
        *   `authRoutes.js`: Routes for user authentication and authorization.
        *   `expenseRoutes.js`: Routes for expense tracking.
        *   `profitRoutes.js`: Routes for profit and sales tracking.
        *   `reportRoutes.js`: Routes for accessing financial reports and KPIs.
        *   `integrationRoutes.js`: Routes for managing external platform integrations.
    *   `services/`: Contains the core business logic. These services perform specific tasks, interact with models, and orchestrate third-party API calls.
        *   `authService.js`: Business logic for user management and authentication.
        *   `expenseService.js`: Business logic for expense tracking, including categorization and calculations.
        *   `profitService.js`: Business logic for profit and revenue tracking, including payout splits and discount handling.
        *   `reportService.js`: Logic for aggregating, processing, and calculating data for financial reports and dashboards (P&L, cash flow, expense breakdown).
        *   `dataProcessingService.js`: Transforms raw data fetched from external APIs into a standardized, usable format for the application's database. Handles data granularity and categorization.
        *   `supabaseService.js`: A thin wrapper around the Supabase client for common database operations and authentication, providing a single, consistent point of interaction with Supabase.
    *   `integrations/`: Modules responsible for interacting with specific external social media and e-commerce APIs. Each module encapsulates the specific logic for fetching, authenticating, and handling data from a particular platform.
        *   `facebookApi.js`: Handles calls to Facebook Graph API for ads data (spend, impressions, clicks, conversions).
        *   `instagramApi.js`: Handles calls to Instagram Business API for engagement insights and ad performance.
        *   `whatsappApi.js`: Handles calls to WhatsApp Business API for conversation data and order confirmations.
        *   `baseApi.js`: Common HTTP client setup for external APIs (e.g., setting up rate limits, error handling).
    *   `tasks/`: Contains logic for automated, scheduled background jobs.
        *   `cronJobs.js`: Defines and schedules cron jobs for periodic data fetching from integrated platforms, ensuring minimal user intervention.
        *   `fetcher.js`: Orchestrates the automated data fetching process, calling individual integration modules and passing fetched data to `dataProcessingService`.
    *   `utils/`: Backend utility functions (e.g., `logger.js` for structured logging, `helpers.js` for common reusable functions like data sanitization or type conversions).
    *   `index.js`: The main entry point for the Node.js server application, setting up Express, middleware, and routes.

*   **`src/shared/`**: Contains code, types, and constants that are shared between the `client` and `server` to ensure consistency and prevent duplication.
    *   `types/`: TypeScript definitions or JSDoc typedefs for data structures used across the application (e.g., `ExpenseType`, `ProfitType`, `UserType`, API request/response shapes). This ensures data contracts are consistent.
    *   `constants/`: Application-wide constants (e.g., `API_ENDPOINTS`, `ERROR_MESSAGES`, `EXPENSE_CATEGORIES`, `REPORT_TYPES`, `PLATFORM_NAMES`).
    *   `validation/`: Shared validation schemas (e.g., using Joi or Yup) that can be used on both client (for immediate feedback on form inputs) and server (for robust API input validation).

**3. Database Directory (`database/`)**

Contains files related to database schema management and Supabase-specific configurations.

*   `migrations/`: Stores SQL migration scripts for version-controlling the database schema. This ensures controlled and repeatable schema evolution.
    *   `V1__initial_schema.sql`: Initial database schema setup with tables for users, expenses, profits, and integrations.
    *   `V2__add_product_profitability_tables.sql`: Example of subsequent migration for product-specific analysis.
*   `functions/`: Directory for Supabase Edge Functions (serverless functions), if complex server-side logic or performance-critical operations are offloaded to Supabase's FaaS.
*   `rls_policies/`: SQL scripts defining Row Level Security (RLS) policies for granular data access control in Supabase, crucial for multi-tenant applications to ensure users only access their own data.
*   `seed/`: Scripts to populate the database with initial or dummy data for development and testing environments, facilitating quick setup.

**4. Tests Directory (`tests/`)**

Organizes all test files, promoting comprehensive testing of the application's components and functionalities.

*   `unit/`: Contains unit tests for individual functions, components, and modules in isolation.
    *   `client/`: Unit tests for React components, custom hooks, and client-side utility functions.
    *   `server/`: Unit tests for backend services, controllers, models, and utility functions.
*   `integration/`: Integration tests to verify interactions between different modules or services (e.g., API endpoint tests, service-to-database interactions, integration module data fetching).
*   `e2e/`: End-to-end tests that simulate full user interactions across the entire application flow to ensure core functionalities work as expected from the user's perspective (e.g., login, track expense, view report).

**5. Documentation Directory (`docs/`)**

Stores all project documentation, including architectural decisions, API specifications, and setup guides. This directory contains the current `projectStructure.md` file.

*   `architecture/`: High-level system architecture diagrams, design documents, and rationale for key technical decisions.
*   `api_spec/`: OpenAPI/Swagger specifications for the backend API, detailing endpoints, request/response formats, and authentication.
*   `setup/`: Detailed guides for setting up the development environment, running tests, and deploying the application.
*   `projectStructure.md`: This document, detailing the file and folder organization.

**6. Scripts Directory (`scripts/`)**

Contains various utility scripts to automate common development and deployment tasks, enhancing developer efficiency.

*   `setup.sh`: Script for initial project setup (e.g., installing dependencies, creating environment files, running initial migrations).
*   `deploy.sh`: Scripts for deploying the application to production or staging environments, potentially automating build processes and server updates.

**7. Deployment Configuration (`.github/workflows/` or `deploy/`)**

*   `.github/workflows/`: (If using GitHub Actions) Contains YAML files defining Continuous Integration/Continuous Deployment (CI/CD) pipelines (e.g., `main.yml` for running tests, building artifacts, and deploying on push to main branch).
*   `deploy/`: (Optional) If not using integrated CI/CD, contains specific deployment configurations or Dockerfiles.
    *   `Dockerfile`: Defines the Docker image for the application, standardizing the runtime environment.
    *   `docker-compose.yml`: For local development orchestration with Docker, managing multiple services (e.g., backend, frontend, local Supabase emulation).
    *   `production.config`: Environment-specific configuration files for production deployments.

This detailed structure allows for clear ownership of code, easier debugging, efficient feature development, and a streamlined development process, particularly as the project scales and new features (like future integrations with Shopify, Stripe, QuickBooks) are added.

## Database Schema Design
SCHEMADESIGN

This section outlines the database schema for the "TrackIt Ecom" application, detailing the entities, their attributes, and the relationships between them. The design prioritizes data integrity, scalability, flexibility for customization, and efficient reporting, leveraging PostgreSQL features through Supabase.

**1. Core Design Principles**
*   **Normalization**: The schema is designed with a focus on normalization to minimize data redundancy and ensure data consistency.
*   **Scalability**: Utilizing UUIDs for primary keys, appropriate indexing, and considering Row-Level Security (RLS) with PostgreSQL will support anticipated user growth and data volume.
*   **Flexibility & Customization**: Customizable categories, support for various API integrations, and JSONB fields for preferences ensure the application can adapt to diverse business needs and future features.
*   **Data Integrity & Accuracy**: An "Approval Queue" system is central to ensuring that automatically fetched data is reviewed and validated by the user before being committed, maintaining high data accuracy.
*   **Auditability**: Timestamps for creation and updates are included in most tables to track data lifecycle.

**2. Entity-Relationship Overview**
The core entities revolve around `Users`, their `Businesses`, `Expenses`, `Revenues`, `Products`, `Categories`, and `API Integrations`.
*   A `User` can manage multiple `Businesses`.
*   Each `Business` has its own `Expenses`, `Revenues`, `Products`, and custom `Categories`.
*   `Expenses` and `Revenues` are linked to specific `Categories` and can be associated with `Products`.
*   `API Integrations` are set up by `Users` to fetch data, which then goes into an `API Approval Queue` before being recorded as `Expenses` or `Revenues`.

**3. Database Tables Definition**

**3.1. `users` Table**
*   **Purpose**: Stores user-specific settings and preferences. Authentication and core user details (email, password hash) are primarily managed by Supabase Auth.
*   **Columns**:
    *   `id` (UUID, Primary Key, Foreign Key to `auth.users.id`): Unique identifier for the user.
    *   `preferences` (JSONB, Nullable): Stores user preferences like dark mode, UI layout, default currency (if not overridden by business), timezone.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of user creation.

**3.2. `businesses` Table**
*   **Purpose**: Represents an individual e-commerce business managed by a user. A single user can manage multiple distinct businesses.
*   **Columns**:
    *   `business_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the business.
    *   `user_id` (UUID, Foreign Key to `public.users.id`, Not Null): Links the business to a specific user.
    *   `name` (TEXT, Not Null): The name of the e-commerce business.
    *   `currency` (TEXT, Not Null, Default 'USD'): The primary currency for this business's financial tracking (e.g., 'USD', 'EUR').
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp when the business record was created.
    *   `updated_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of the last update to the business record.

**3.3. `categories` Table**
*   **Purpose**: Defines expense and revenue categories. These can be pre-defined system categories or custom categories created by the user for a specific business.
*   **Columns**:
    *   `category_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the category.
    *   `business_id` (UUID, Foreign Key to `public.businesses.business_id`, Nullable): Links the category to a specific business. Null for system-wide default categories.
    *   `name` (TEXT, Not Null): The name of the category (e.g., "Advertising", "Shipping", "Sales").
    *   `type` (TEXT, Not Null, Enum: 'Expense', 'Revenue'): Specifies if the category is for expenses or revenues.
    *   `is_custom` (BOOLEAN, Not Null, Default TRUE): Indicates if the category was user-defined (TRUE) or system-provided (FALSE).
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of category creation.
    *   `updated_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of the last update.
    *   `CONSTRAINT UNIQUE (business_id, name, type)`: Ensures unique category names per business and type.

**3.4. `expenses` Table**
*   **Purpose**: Stores detailed records of all expenses incurred by a business, whether manually entered or fetched via API.
*   **Columns**:
    *   `expense_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the expense record.
    *   `business_id` (UUID, Foreign Key to `public.businesses.business_id`, Not Null): Links the expense to a business.
    *   `category_id` (UUID, Foreign Key to `public.categories.category_id`, Not Null): The category under which the expense is classified.
    *   `amount` (NUMERIC(18, 4), Not Null): The monetary value of the expense.
    *   `description` (TEXT, Not Null): A brief description of the expense.
    *   `transaction_date` (DATE, Not Null): The date when the expense occurred.
    *   `source` (TEXT, Not Null, Enum: 'Manual', 'Facebook_Ads', 'Instagram_Ads', 'WhatsApp', 'Other_API'): Indicates how the expense record was generated.
    *   `source_ref_id` (TEXT, Nullable): An optional reference ID from the external source (e.g., ad campaign ID, invoice number).
    *   `approval_id` (UUID, Foreign Key to `public.api_approval_queue.approval_id`, Nullable): Links to the original approval queue entry if created via API.
    *   `notes` (TEXT, Nullable): Additional notes or context for the expense.
    *   `tags` (TEXT[], Nullable): An array of user-defined tags for further categorization.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp when the expense record was created.
    *   `updated_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of the last update.

**3.5. `revenues` Table**
*   **Purpose**: Stores detailed records of all income and sales revenue for a business.
*   **Columns**:
    *   `revenue_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the revenue record.
    *   `business_id` (UUID, Foreign Key to `public.businesses.business_id`, Not Null): Links the revenue to a business.
    *   `category_id` (UUID, Foreign Key to `public.categories.category_id`, Not Null): The category under which the revenue is classified (e.g., "Sales", "Refunds_In").
    *   `amount` (NUMERIC(18, 4), Not Null): The monetary value of the revenue.
    *   `description` (TEXT, Not Null): A brief description of the revenue.
    *   `transaction_date` (DATE, Not Null): The date when the revenue occurred.
    *   `source` (TEXT, Not Null, Enum: 'Manual', 'WhatsApp_Sales', 'Ecom_Platform', 'Payment_Gateway', 'Other_API'): Indicates how the revenue record was generated.
    *   `source_ref_id` (TEXT, Nullable): An optional reference ID from the external source (e.g., order ID, payout ID).
    *   `approval_id` (UUID, Foreign Key to `public.api_approval_queue.approval_id`, Nullable): Links to the original approval queue entry if created via API.
    *   `is_discount_applied` (BOOLEAN, Not Null, Default FALSE): Flag if a discount was applied to this revenue.
    *   `discount_amount` (NUMERIC(18, 4), Nullable): The amount of discount applied.
    *   `is_refund_processed` (BOOLEAN, Not Null, Default FALSE): Flag if this revenue represents a refund that was processed (deduction from sales).
    *   `refund_amount` (NUMERIC(18, 4), Nullable): The amount of refund processed.
    *   `notes` (TEXT, Nullable): Additional notes or context.
    *   `tags` (TEXT[], Nullable): An array of user-defined tags.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp when the revenue record was created.
    *   `updated_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of the last update.

**3.6. `products` Table**
*   **Purpose**: Stores information about products sold by the business, enabling product-specific profitability analysis.
*   **Columns**:
    *   `product_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the product.
    *   `business_id` (UUID, Foreign Key to `public.businesses.business_id`, Not Null): Links the product to a business.
    *   `name` (TEXT, Not Null): The name of the product.
    *   `sku` (TEXT, Nullable): Stock Keeping Unit, unique per business if provided.
    *   `cost_of_goods_sold` (NUMERIC(18, 4), Nullable): The cost associated with producing or acquiring the product.
    *   `selling_price` (NUMERIC(18, 4), Nullable): The typical selling price of the product.
    *   `description` (TEXT, Nullable): A brief description of the product.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of product creation.
    *   `updated_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of the last update.
    *   `CONSTRAINT UNIQUE (business_id, sku)`: Ensures unique SKUs per business if present.

**3.7. `expense_product_associations` Table** (Junction Table)
*   **Purpose**: Links expenses to specific products when an expense is related to one or more products (e.g., manufacturing cost split across products).
*   **Columns**:
    *   `association_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the association.
    *   `expense_id` (UUID, Foreign Key to `public.expenses.expense_id`, Not Null): Links to the expense record.
    *   `product_id` (UUID, Foreign Key to `public.products.product_id`, Not Null): Links to the product.
    *   `allocated_amount` (NUMERIC(18, 4), Nullable): The portion of the expense allocated to this specific product.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of association creation.
    *   `CONSTRAINT UNIQUE (expense_id, product_id)`: Ensures unique association.

**3.8. `revenue_product_associations` Table** (Junction Table)
*   **Purpose**: Links revenue transactions to specific products, allowing detailed product profitability analysis.
*   **Columns**:
    *   `association_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the association.
    *   `revenue_id` (UUID, Foreign Key to `public.revenues.revenue_id`, Not Null): Links to the revenue record.
    *   `product_id` (UUID, Foreign Key to `public.products.product_id`, Not Null): Links to the product.
    *   `quantity` (INTEGER, Nullable): Quantity of the product sold in this revenue transaction.
    *   `price_per_unit` (NUMERIC(18, 4), Nullable): Selling price of this product per unit in this transaction.
    *   `line_item_total` (NUMERIC(18, 4), Nullable): Total amount for this specific product in the transaction.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of association creation.
    *   `CONSTRAINT UNIQUE (revenue_id, product_id)`: Ensures unique association.

**3.9. `api_account_integrations` Table**
*   **Purpose**: Stores details for connecting to various external APIs (Facebook, Instagram, WhatsApp, etc.).
*   **Columns**:
    *   `integration_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the API integration.
    *   `user_id` (UUID, Foreign Key to `public.users.id`, Not Null): Links the integration to a specific user.
    *   `business_id` (UUID, Foreign Key to `public.businesses.business_id`, Nullable): Allows integrations to be business-specific if a user has multiple.
    *   `platform` (TEXT, Not Null, Enum: 'Facebook', 'Instagram', 'WhatsApp', 'Shopify', 'Stripe', 'QuickBooks', 'Google_Ads', 'TikTok_Ads', 'ShipStation', 'Other'): The name of the integrated platform.
    *   `account_identifier` (TEXT, Nullable): A user-friendly identifier for the linked account (e.g., Facebook Ad Account Name).
    *   `access_token_encrypted` (TEXT, Not Null): Encrypted access token for API calls. Stored securely using database encryption features (e.g., Supabase Vault or app-level encryption).
    *   `refresh_token_encrypted` (TEXT, Nullable): Encrypted refresh token, if applicable for the API.
    *   `token_expiry` (TIMESTAMP WITH TIMEZONE, Nullable): Expiry date of the access token.
    *   `last_sync_at` (TIMESTAMP WITH TIMEZONE, Nullable): Timestamp of the last successful data synchronization.
    *   `status` (TEXT, Not Null, Enum: 'Connected', 'Disconnected', 'Expired', 'Error', 'Pending'): Current status of the integration.
    *   `error_message` (TEXT, Nullable): Details of any error encountered during sync.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of integration setup.
    *   `updated_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of the last status/token update.

**3.10. `api_data_ingestion_logs` Table**
*   **Purpose**: Logs details of automated data fetching processes from integrated APIs.
*   **Columns**:
    *   `log_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the log entry.
    *   `integration_id` (UUID, Foreign Key to `public.api_account_integrations.integration_id`, Not Null): Links to the specific API integration.
    *   `sync_start_time` (TIMESTAMP WITH TIMEZONE, Not Null): Time when the data sync began.
    *   `sync_end_time` (TIMESTAMP WITH TIMEZONE, Nullable): Time when the data sync ended.
    *   `status` (TEXT, Not Null, Enum: 'Success', 'Partial_Success', 'Failure', 'Processing'): Status of the sync operation.
    *   `records_fetched_count` (INTEGER, Not Null, Default 0): Number of records successfully fetched.
    *   `error_details` (JSONB, Nullable): Detailed error messages or stack traces if the sync failed.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of log creation.

**3.11. `api_approval_queue` Table**
*   **Purpose**: Holds raw data fetched from APIs that requires user review and approval before being recorded as a definitive expense or revenue. This is central to the "minimal user intervention" requirement.
*   **Columns**:
    *   `approval_id` (UUID, Primary Key, Default gen_random_uuid()): Unique identifier for the pending approval item.
    *   `business_id` (UUID, Foreign Key to `public.businesses.business_id`, Not Null): Links the data to a specific business.
    *   `source_platform` (TEXT, Not Null, Enum: 'Facebook', 'Instagram', 'WhatsApp', 'Other_API'): The API platform from which the data originated.
    *   `source_record_id` (TEXT, Not Null): A unique identifier from the source platform (e.g., Facebook Ad ID, WhatsApp message ID). Critical for duplicate detection.
    *   `data_type` (TEXT, Not Null, Enum: 'Expense', 'Revenue'): Indicates if the data represents a proposed expense or revenue.
    *   `raw_data` (JSONB, Not Null): The original, unparsed JSON data received from the API.
    *   `proposed_amount` (NUMERIC(18, 4), Not Null): The system's suggested monetary value.
    *   `proposed_description` (TEXT, Not Null): The system's suggested description.
    *   `proposed_transaction_date` (DATE, Not Null): The system's suggested transaction date.
    *   `proposed_category_id` (UUID, Foreign Key to `public.categories.category_id`, Nullable): The system's suggested category ID.
    *   `detected_issues` (TEXT[], Nullable): An array of issues detected by the system (e.g., 'Conflict', 'Duplicate', 'Missing_Category', 'Missing_Date', 'Unusual_Amount').
    *   `status` (TEXT, Not Null, Enum: 'Pending_Review', 'Approved', 'Edited', 'Rejected', 'Flagged_For_Review', 'Merged_Duplicate', Default 'Pending_Review'): Current status of the approval item.
    *   `reviewed_by_user_id` (UUID, Foreign Key to `public.users.id`, Nullable): User who performed the review.
    *   `review_date` (TIMESTAMP WITH TIMEZONE, Nullable): Timestamp of user review.
    *   `created_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp when the item entered the queue.
    *   `updated_at` (TIMESTAMP WITH TIMEZONE, Not Null, Default NOW()): Timestamp of the last update to the queue item (e.g., status change).
    *   `CONSTRAINT UNIQUE (business_id, source_platform, source_record_id)`: Prevents duplicate entries for the same source record within a business's queue.

**4. Relationships**

*   `users.id` ONE-TO-MANY `businesses.user_id`
*   `users.id` ONE-TO-MANY `api_account_integrations.user_id`
*   `businesses.business_id` ONE-TO-MANY `categories.business_id`
*   `businesses.business_id` ONE-TO-MANY `expenses.business_id`
*   `businesses.business_id` ONE-TO-MANY `revenues.business_id`
*   `businesses.business_id` ONE-TO-MANY `products.business_id`
*   `businesses.business_id` ONE-TO-MANY `api_approval_queue.business_id`
*   `categories.category_id` ONE-TO-MANY `expenses.category_id`
*   `categories.category_id` ONE-TO-MANY `revenues.category_id`
*   `api_account_integrations.integration_id` ONE-TO-MANY `api_data_ingestion_logs.integration_id`
*   `api_approval_queue.approval_id` ONE-TO-ONE `expenses.approval_id` (or `revenues.approval_id`) - once approved, a record is moved/linked.
*   `expenses.expense_id` ONE-TO-MANY `expense_product_associations.expense_id`
*   `products.product_id` ONE-TO-MANY `expense_product_associations.product_id`
*   `revenues.revenue_id` ONE-TO-MANY `revenue_product_associations.revenue_id`
*   `products.product_id` ONE-TO-MANY `revenue_product_associations.product_id`

**5. Data Granularity and Reporting Support**

*   **Transaction-Level Data**: Both `expenses` and `revenues` tables store data at the transaction level, providing the highest possible granularity for detailed analysis.
*   **Aggregations**: Daily, weekly, or monthly summaries, along with KPIs (Profit & Loss, Profit Margin Percentage, Cash Flow, Expense Breakdown, Sales Trends, Product Profitability, Customer Acquisition Costs), will be generated via SQL queries using `GROUP BY` clauses on the `transaction_date` and joining with `categories` and `products` tables. For performance at scale, materialized views can be introduced for frequently accessed aggregated data.
*   **Product-Specific Analysis**: The `expense_product_associations` and `revenue_product_associations` tables enable linking transactions to individual products, allowing for profitability analysis at the product level.

**6. API Integration Data Flow**

1.  **Configuration**: Users configure API integrations in `api_account_integrations`, storing encrypted credentials.
2.  **Automated Fetching**: A background service regularly queries external APIs (Facebook Graph API, Instagram Business API, WhatsApp Business API) for relevant expense and revenue data points.
3.  **Ingestion Logging**: Each sync process is logged in `api_data_ingestion_logs`.
4.  **Queueing for Approval**: Raw fetched data is parsed, enriched (e.g., auto-suggested category), and placed into the `api_approval_queue` table. Duplicate detection and conflict identification mechanisms populate the `detected_issues` array.
5.  **User Review**: The user interface presents items from `api_approval_queue` for review. Users can:
    *   `Approve`: Move the data into `expenses` or `revenues` tables "as is."
    *   `Edit`: Modify `proposed_amount`, `description`, `transaction_date`, `category_id`, add `notes` or `tags` before approving and moving to `expenses`/`revenues`.
    *   `Categorize`: Assign or reassign categories.
    *   `Reject`/`Delete`: Remove the item from the queue without recording it.
    *   `Flag for Review`: Mark an item for later scrutiny.
    *   `Merge`: Handle duplicates by merging information into one approved record.
6.  **Persistence**: Upon approval (or editing and approval), the data is moved from `api_approval_queue` to the `expenses` or `revenues` table, with a foreign key reference back to the `approval_id`.

**7. Security Considerations in Schema**

*   **Authentication & Authorization**: Supabase Auth handles user login. Row-Level Security (RLS) policies will be rigorously applied to all tables (`businesses`, `expenses`, `revenues`, `products`, `categories`, `api_account_integrations`, `api_approval_queue`) to ensure users can only access and modify data belonging to their `user_id` or associated `business_id`.
*   **Sensitive Data Storage**: API `access_token_encrypted` and `refresh_token_encrypted` fields are designed to store sensitive tokens in an encrypted format within the database. This encryption can be managed via Supabase's built-in vault features or through application-level encryption before data persistence.
*   **Data Minimization**: The schema is designed to collect only the essential data points required for the application's functionality.
*   **Auditability**: `created_at` and `updated_at` timestamps on most tables, along with Supabase's audit logs, support tracking changes.

**8. Extensibility**

The schema is built with extensibility in mind for future integrations:
*   The `api_account_integrations.platform` enum can be expanded to include new e-commerce platforms (Shopify, WooCommerce), payment gateways (Stripe, PayPal), accounting software (QuickBooks, Xero), and other advertising/logistics platforms.
*   The `source` enum in `expenses` and `revenues` can also be extended.
*   The `raw_data` JSONB field in `api_approval_queue` provides flexibility to store varied data structures from new APIs without immediate schema alterations, allowing for gradual integration of specific fields as needed.
*   Modular design, where new integration types might introduce their own specific data tables (e.g., `shopify_orders`), can easily be linked to core `expenses` and `revenues` tables via reference IDs, maintaining the financial core without bloating it.

## User Flow
USERFLOW

1. User Flow: Onboarding & Initial Setup
   User Goal: Set up their TrackIt Ecom account, connect social media platforms, and prepare for automated data tracking.
   Trigger: First-time app launch after successful registration/login.

   Steps/Interactions:
   1. Welcome Screen:
      - Wireframe Description: A simple screen displaying the app's logo, a brief welcome message (e.g., "Simplify your e-commerce finances!"), and a prominent "Get Started" button.
      - Interaction Pattern: User taps the "Get Started" button.
      - System Action: Proceeds to the next setup step.
   2. Platform Connection Prompt:
      - Wireframe Description: A screen titled "Connect Your Business Accounts" with sections or cards for Facebook, Instagram, and WhatsApp Business. Each section includes the platform's logo, a brief description of what data will be synced (e.g., "Ad spend & campaign performance"), and a "Connect" button. Explanatory text emphasizes data privacy and security.
      - Interaction Pattern: User taps the "Connect" button for Facebook (then repeats for Instagram and WhatsApp).
      - System Action: Initiates the OAuth 2.0 flow for the respective platform, redirecting the user to the platform's secure login/permission page.
   3. External OAuth Authorization (Facebook, Instagram, WhatsApp):
      - Wireframe Description: (External to the app) The user is directed to the social media platform's official login and permissions page. They will log in (if not already) and review the permissions requested by TrackIt Ecom (e.g., "Read your ad accounts", "Access business insights").
      - Interaction Pattern: User grants the requested permissions.
      - System Action: The platform redirects the user back to TrackIt Ecom with an authorization token. TrackIt Ecom's backend uses this token to establish the API connection.
   4. Connection Confirmation & Initial Data Sync:
      - Wireframe Description: Upon successful connection, the platform's status on the "Connect Your Business Accounts" screen changes from "Connect" to "Connected". A loading indicator or progress bar appears (e.g., "Syncing initial data from connected accounts..."). Messages like "Fetching Facebook Ads data...", "Retrieving Instagram insights...", "Analyzing WhatsApp conversations..." may cycle.
      - Interaction Pattern: User waits for the initial sync to complete. They can see progress or read tips.
      - System Action: The app's backend initiates API calls to fetch historical data from all connected platforms (e.g., last 3-6 months of ad spend, sales conversions, relevant chat data).
   5. Dashboard Preview & Guided Tour:
      - Wireframe Description: After the initial sync, the user is directed to their main dashboard. Initially, it might display aggregated data or placeholder insights. A brief, interactive guided tour or tooltips might appear, highlighting key sections (e.g., "This is your Total Profit KPI", "Click here to see your expense breakdown").
      - Interaction Pattern: User explores the dashboard, dismisses the tour, or clicks on highlighted areas.
      - System Action: The dashboard updates in real-time as data continues to populate. User preferences (like default currency, date range) are applied.

   Error Handling/Edge Cases:
   - Connection Failure: If OAuth fails (e.g., incorrect credentials, permissions denied), a clear error message "Connection to [Platform Name] failed. Please try again." is displayed with a "Retry" button.
   - Missing Permissions: If the user denies crucial permissions, the app explains which permissions are needed and guides them on how to grant them through the platform's settings if re-prompting isn't possible.
   - API Rate Limits/Temporary Issues: Display a message "Temporarily unable to fetch data from [Platform Name]. We'll retry automatically. Please check your internet connection." Implement exponential backoff for retries.

2. User Flow: Automated Data Review & Approval
   User Goal: Review, approve, edit, categorize, or reject automatically fetched expense/profit data to ensure accuracy and complete financial records.
   Trigger: New data is fetched and ready for user review (daily/weekly schedule). User receives an in-app notification or sees an alert on the dashboard.

   Steps/Interactions:
   1. Notification/Dashboard Alert:
      - Wireframe Description: On the main dashboard, a prominent widget or alert box indicates "X new transactions pending review". A notification badge might also appear on the "Transactions" or "Review" tab in the navigation.
      - Interaction Pattern: User taps on the "Pending Review" alert/widget.
      - System Action: Directs the user to the dedicated "Pending Review" screen.
   2. Pending Review List:
      - Wireframe Description: A screen titled "Transactions Pending Review" displaying a list of newly fetched entries. Each entry shows key details: Source (e.g., "Facebook Ads", "WhatsApp Chat"), Date, Amount, a brief Description (e.g., "Ad Spend for Campaign ABC", "WhatsApp Order #123"), and an initial status (e.g., "Uncategorized", "Needs Review"). Filters (by platform, type) and sorting options are available.
      - Interaction Pattern: User scrolls through the list. User can tap on a single entry to view its details or select multiple entries using checkboxes for batch actions.
      - System Action: Populates the list with recently fetched and unreviewed data.
   3. Detailed Review & Action (Single Entry):
      - Wireframe Description: A modal or full-screen view appears, showing the selected transaction's details in editable fields:
         - "Source": (Read-only, e.g., "Facebook Ads")
         - "Date": (Date picker, pre-filled, editable)
         - "Description": (Text input, pre-filled, editable)
         - "Amount": (Numeric input, pre-filled, editable)
         - "Category": (Dropdown with suggested categories based on source/description, search function, and "Add Custom Category" option).
         - "Notes/Tags": (Optional text area).
         - "Detected Issues": (If applicable, e.g., "Potential Duplicate found with similar transaction on [Date]", with "Merge" and "Discard Duplicate" buttons).
         - Action Buttons: "Approve as is", "Edit & Approve", "Flag for Review", "Reject/Delete".
      - Interaction Pattern:
         - Approve as is: User taps "Approve as is".
         - Edit values: User modifies fields (Amount, Date, Description), selects a category, adds notes, then taps "Edit & Approve" or "Save Changes".
         - Categorize: User selects a category from the dropdown or types a new one.
         - Add notes/tags: User types additional context.
         - Reject/Delete: User taps "Reject/Delete" (a confirmation dialog appears).
         - Flag for review: User taps "Flag for Review" to mark it for later attention.
         - Resolve Conflicts/Duplicates: If a duplicate is detected, user reviews details of both transactions and chooses "Merge" (combining relevant info and amounts) or "Discard Duplicate" (deleting the current fetched entry).
      - System Action:
         - Data Validation: Validates user input before saving.
         - Duplicate Detection: Runs an algorithm to identify potential duplicates based on amount, date, source, and description, presenting options to the user.
         - Category Learning: Remembers user's chosen categories for similar descriptions/sources, improving future auto-categorization suggestions.
         - Logging: Moves the approved/edited data to the main financial ledger. Logs all user actions for audit trail purposes.
   4. Batch Actions (Optional):
      - Wireframe Description: When multiple entries are selected in the "Pending Review List" (via checkboxes), a floating action bar appears at the bottom or top of the screen with options like "Approve Selected", "Categorize Selected", "Reject Selected".
      - Interaction Pattern: User selects multiple items, then taps a batch action button.
      - System Action: Applies the chosen action (e.g., approval, categorization) to all selected items simultaneously.

   Error Handling/Edge Cases:
   - Invalid Input: If the user enters non-numeric data for an amount or an invalid date, a specific error message (e.g., "Please enter a valid amount") is displayed, highlighting the problematic field.
   - Conflict Resolution: If conflicting data is detected (e.g., different amounts for the "same" transaction from different sources), the system flags it and prompts the user to manually reconcile or choose the correct value.
   - Rejection Confirmation: Before rejecting/deleting an entry, a confirmation dialog "Are you sure you want to reject this entry? It will not be recorded." appears to prevent accidental data loss.

3. User Flow: Manual Data Entry (Expense or Profit)
   User Goal: Manually add an expense or profit entry that wasn't automatically captured by API integrations.
   Trigger: User identifies a missing transaction (e.g., cash payment, a service fee not from an integrated platform) or wishes to record a specific event.

   Steps/Interactions:
   1. Initiate Manual Entry:
      - Wireframe Description: A prominent Floating Action Button (FAB) with a "+" icon is present on the main dashboard or a dedicated "Transactions" screen. Tapping it reveals options like "Add Expense" and "Add Income".
      - Interaction Pattern: User taps the "+" FAB, then selects "Add Expense" or "Add Income".
      - System Action: Navigates to the respective data entry form.
   2. Manual Entry Form:
      - Wireframe Description: A clean, intuitive form with the following fields:
         - "Type": (Pre-selected as "Expense" or "Income", read-only).
         - "Date": (Date picker, defaults to current date, editable).
         - "Amount": (Numeric input field, required).
         - "Description": (Text input, e.g., "Office supplies from local store", "Freelance design work payment").
         - "Category": (Dropdown with all pre-defined and custom categories, search functionality, and an "Add New Category" option).
         - "Source/Notes": (Optional text area for additional context like "Cash payment", "Client X", or specific details).
         - A "Save" or "Add Transaction" button.
      - Interaction Pattern: User fills out all required fields, uses the date picker, selects a category (or adds a new one), and provides a description. Optional fields can be left blank.
      - System Action: Validates input in real-time (e.g., ensuring amount is numeric).
   3. Save Entry:
      - Wireframe Description: "Save" or "Add Transaction" button at the bottom of the form.
      - Interaction Pattern: User taps the "Save" button.
      - System Action: Validates data upon submission. If valid, saves the new transaction to the user's financial ledger. Triggers real-time updates to relevant reports and the dashboard. Displays a brief success message (e.g., "Transaction added successfully!").
   4. Confirmation & Return:
      - Wireframe Description: A small toast notification or banner confirms success. The user is then returned to the previous screen (e.g., Transactions list) or the main dashboard.
      - Interaction Pattern: User acknowledges the confirmation.
      - System Action: The newly added transaction is immediately visible in transaction lists and reflected in financial reports.

   Error Handling/Edge Cases:
   - Missing Required Fields: If a required field (e.g., Amount) is left blank, the app highlights it and displays an error message (e.g., "Amount is required") upon attempting to save.
   - Invalid Data Format: If an invalid format is entered (e.g., text in amount field), a specific error message appears (e.g., "Please enter a valid number for amount").
   - Category Management: If a new custom category is added, it's immediately available for selection in other entries and in category management settings.

4. User Flow: Reporting & Dashboard Interaction
   User Goal: View real-time financial health, analyze trends, and generate custom reports to make informed business decisions.
   Trigger: User opens the app or navigates to the "Dashboard" or "Reports" section from the main navigation.

   Steps/Interactions:
   1. Dashboard View:
      - Wireframe Description: A personalized dashboard displaying key financial KPIs (e.g., "Total Revenue", "Total Expenses", "Net Profit", "Profit Margin %") prominently at the top. Below these, customizable widgets show visualizations like "Expense Breakdown by Category" (Pie Chart), "Revenue & Expense Trends" (Line Graph over time), "Product Profitability" (Table/Bar Chart), and a summary of "Pending Review" items. A date range selector (e.g., "This Month", "Last 7 Days", "Custom Range") is visible at the top.
      - Interaction Pattern:
         - View KPIs and Charts: User visually assesses their financial status.
         - Change Date Range: User taps the date range selector. A modal appears with predefined options (e.g., Today, Last 7 Days, This Month, Last Quarter, This Year, All Time) and a "Custom Range" option with calendar pickers. User selects an option and taps "Apply".
         - Customize Dashboard: User taps an "Edit Dashboard" button. Widgets become draggable and resizable. Options to "Add Widget" (from a library of available charts/tables) or "Remove Widget" appear. User re-arranges, adds, or removes widgets, then taps "Save Layout".
      - System Action: Real-time recalculation and regeneration of all KPIs and charts based on the selected date range or customized layout. Data is aggregated efficiently.
   2. Detailed Reports Navigation:
      - Wireframe Description: A navigation menu (e.g., a side drawer or bottom bar) includes a "Reports" section. Tapping it reveals sub-options: "Profit & Loss", "Cash Flow", "Expense Breakdown", "Product Profitability", "Sales Trends", "Customer Acquisition Costs".
      - Interaction Pattern: User taps on a specific report type (e.g., "Profit & Loss").
      - System Action: Navigates to the selected detailed report screen.
   3. Report View (e.g., Profit & Loss Statement):
      - Wireframe Description: A screen dedicated to the selected report. For a P&L, it displays a tabular summary of Income (e.g., Sales Revenue, Discounts) and Expenses (broken down by categories like Advertising, Product Costs, Shipping, Software Subscriptions, etc.) over the selected period, culminating in "Net Profit". Filters for date range, category, or specific products (where applicable) are present. "Export" options (CSV, PDF) are available.
      - Interaction Pattern:
         - Filter Data: User applies different date ranges or uses category/product filters to narrow down the report data.
         - Drill Down: User can tap on a specific category (e.g., "Advertising Spend" in the P&L) to view a list of all individual transactions that make up that total for the period.
         - Export: User taps the "Export" button, chooses a format (CSV/PDF), and initiates download.
      - System Action:
         - Real-time Report Generation: Queries the database and aggregates data to generate the report dynamically based on applied filters.
         - Data Granularity: Allows users to switch between transaction-level, daily, weekly, or monthly granularity for comprehensive analysis.
         - Export Generation: Compiles the report data into the chosen export format.

   Error Handling/Edge Cases:
   - No Data for Period: If no transactions exist for the selected date range or filters, the report displays "No data available for this period. Try a different date range or adjust your filters."
   - Slow Loading for Large Data Sets: For very large datasets, a persistent loading indicator appears, and a message like "Generating report, this may take a moment..." is shown. Potential for background processing for extremely large reports.
   - Inconsistent Data: If data discrepancies are detected (e.g., calculation errors), an internal alert is triggered for review, and the user is informed of temporary data issues if unresolvable.

5. User Flow: Customization & Settings
   User Goal: Personalize app settings, manage custom categories, and oversee connected accounts.
   Trigger: User taps the "Settings" or profile icon in the main navigation.

   Steps/Interactions:
   1. Access Settings Menu:
      - Wireframe Description: A navigation item, typically labeled "Settings" or represented by a gear icon, is part of the main menu (e.g., bottom bar, side drawer, or user profile dropdown).
      - Interaction Pattern: User taps the "Settings" icon.
      - System Action: Navigates to the main settings menu.
   2. Main Settings Menu:
      - Wireframe Description: A list of setting categories: "General Settings", "Manage Categories", "Connected Accounts", "Notifications", "Security & Privacy", "Help & Support".
      - Interaction Pattern: User taps on a specific setting category (e.g., "Manage Categories").
      - System Action: Navigates to the selected settings sub-screen.
   3. Manage Categories:
      - Wireframe Description: A screen titled "Manage Categories" displays a list of all existing expense and income categories (both system-defined and user-created). Each category has "Edit" (pencil icon) and "Delete" (trash can icon) actions next to it. A prominent "Add New Category" button is at the top or bottom.
      - Interaction Pattern:
         - Add New Category: User taps "Add New Category". A modal or inline input field appears. User types the new category name and taps "Save".
         - Edit Category: User taps the "Edit" icon next to a category. The category name becomes editable. User modifies the name and taps "Save".
         - Delete Category: User taps the "Delete" icon. A confirmation prompt appears: "Are you sure you want to delete '[Category Name]'? All transactions currently assigned to this category will become 'Uncategorized' or can be reassigned." User confirms or cancels.
      - System Action: Updates the database with new/edited/deleted categories. If a category is deleted, relevant transactions are either uncategorized or prompted for reassignment. Categories are immediately available in manual entry forms.
   4. General Settings:
      - Wireframe Description: A screen with various general customization options:
         - "Theme": Toggle switch for "Light Mode" / "Dark Mode".
         - "Default Currency": Dropdown selector (e.g., USD, EUR, GBP).
         - "Default Dashboard View": Dropdown to set the default date range for the dashboard upon app launch (e.g., "Last 30 Days", "This Month", "Last Week").
      - Interaction Pattern: User toggles switches, selects options from dropdowns.
      - System Action: Saves preferences to user's profile. Theme changes apply instantly. Default views are updated for subsequent app launches.
   5. Connected Accounts:
      - Wireframe Description: A screen listing all integrated platforms (Facebook, Instagram, WhatsApp) with their current connection status (e.g., "Connected", "Connection Expired"). For each, there are buttons to "Reconnect" (if connection is lost/expired) or "Disconnect".
      - Interaction Pattern: User taps "Reconnect" to re-authenticate an expired connection, or "Disconnect" to remove an integration (with confirmation).
      - System Action: Manages OAuth token refresh and revocation. If disconnected, stops future automated data fetches from that platform.

   Error Handling/Edge Cases:
   - Category Deletion with Transactions: The system presents a warning and offers to reassign affected transactions to another category before permanent deletion, preventing data loss.
   - Reconnection Failure: If "Reconnect" fails, the app provides specific guidance (e.g., "Please check your credentials on Facebook's website and try again.") rather than a generic error.
   - Invalid Input for Settings: For free-text settings (if any), input validation ensures valid data is saved.

## Styling Guidelines
This section outlines the styling guidelines for "TrackIt Ecom", ensuring a consistent, intuitive, and visually appealing user experience. Our design philosophy emphasizes clarity, simplicity, and a modern aesthetic, drawing inspiration from financial tools like QuickBooks, Xero, and Mint. The goal is to create a professional yet approachable interface that empowers e-commerce business owners with effortless financial management.

**1. Design System Principles**
The "TrackIt Ecom" design system is built upon the following core principles:

*   **Consistency:** Maintain a uniform look and feel across all components, pages, and interactions to reduce cognitive load and enhance learnability.
*   **Clarity & Simplicity:** Prioritize clean layouts, minimal distractions, and straightforward presentation of information, especially complex financial data. Every element should serve a clear purpose.
*   **User-Centricity:** Design with the e-commerce entrepreneur in mind, ensuring ease of use, intuitive workflows, and direct access to critical financial insights.
*   **Scalability & Reusability:** Develop modular, reusable components that can be efficiently scaled and adapted for future features and integrations, ensuring long-term maintainability.
*   **Responsiveness:** Ensure the interface is fully responsive and optimized for various screen sizes and devices, providing a seamless experience whether on desktop or mobile.
*   **Accessibility:** Design for inclusivity, adhering to accessibility standards to ensure the app is usable by individuals with diverse needs.
*   **Customizability:** Provide users with options to personalize their experience, acknowledging diverse preferences and workflows, thereby increasing engagement and satisfaction.

**2. Color Palette**
The color palette for "TrackIt Ecom" is designed to convey professionalism, trustworthiness, and a calming presence, suitable for financial data. Accent colors are used strategically for emphasis, interactive elements, and clear data visualization.

*   **Primary Colors (Calming & Professional):**
    *   **Blues:** Represent trust, stability, and intelligence. Used for primary branding, backgrounds, and key interactive elements.
        *   `--color-primary-blue-dark`: #2C3E50 (Dark Navy - for primary headings, backgrounds in dark mode)
        *   `--color-primary-blue-medium`: #3498DB (Standard Blue - for interactive elements, main call-to-actions)
        *   `--color-primary-blue-light`: #ECF0F1 (Light Gray-Blue - for light backgrounds, secondary containers)
    *   **Grays:** Offer neutrality, sophistication, and balance. Used for text, borders, and subtle backgrounds.
        *   `--color-neutral-gray-dark`: #7F8C8D (Dark Gray - for body text, disabled states)
        *   `--color-neutral-gray-medium`: #BDC3C7 (Medium Gray - for borders, dividers)
        *   `--color-neutral-gray-light`: #F2F4F7 (Light Gray - for card backgrounds, subtle sections)
        *   `--color-background`: #FFFFFF (Pure White - for main application background in light mode)

*   **Accent Colors (Highlight & Action):**
    *   `--color-accent-green`: #27AE60 (Success/Profit - for positive metrics, successful actions)
    *   `--color-accent-red`: #E74C3C (Warning/Loss - for alerts, negative metrics, errors)
    *   `--color-accent-orange`: #F39C12 (Highlight/Alert - for warnings, key information emphasis)
    *   `--color-accent-purple`: #8E44AD (Categorization/Data visualization - for distinct categories or chart segments)

*   **Semantic Colors:**
    *   `--color-status-success`: `--color-accent-green`
    *   `--color-status-warning`: `--color-accent-orange`
    *   `--color-status-error`: `--color-accent-red`
    *   `--color-status-info`: `--color-primary-blue-medium`

*   **Dark Mode Palette:**
    *   Colors will be inversed or adjusted to ensure comfortable viewing in low-light conditions.
    *   `--color-background-dark`: #1A202C (Dark charcoal)
    *   `--color-card-background-dark`: #2D3748 (Dark slate)
    *   Text colors will shift to lighter grays (e.g., `--color-neutral-gray-light` for primary text) to maintain readability against dark backgrounds.
    *   Accent colors will retain their vibrancy but may have slight adjustments to ensure visual harmony within the dark theme.

**3. Typography**
Typography is chosen for optimal readability, clarity, and a modern aesthetic, consistent with financial applications.

*   **Font Family:** A clean, geometric sans-serif font is preferred for its legibility and modern appearance.
    *   **Primary Font:** "Inter" (or similar open-source alternative like "Roboto", "Open Sans")
    *   **Fallback Fonts:** `sans-serif`

*   **Font Weights:**
    *   Light: 300
    *   Regular: 400
    *   Medium: 500
    *   Semi-bold: 600
    *   Bold: 700

*   **Text Hierarchy & Sizing (Examples):**
    *   `--font-size-h1`: 36px (Extra Large Headers - for main dashboard titles)
    *   `--font-size-h2`: 28px (Large Headers - for section titles within reports)
    *   `--font-size-h3`: 22px (Medium Headers - for sub-sections, widget titles)
    *   `--font-size-h4`: 18px (Small Headers - for card titles, key metrics)
    *   `--font-size-body-large`: 16px (Main Body Text - for comfortable reading)
    *   `--font-size-body-medium`: 14px (Standard Text - for labels, descriptions)
    *   `--font-size-body-small`: 12px (Helper Text, Captions - for secondary information)
    *   `--font-size-button`: 16px (Button Text)
    *   `--font-size-input`: 16px (Input Field Text)

*   **Line Height & Spacing:**
    *   `--line-height-heading`: 1.2
    *   `--line-height-body`: 1.6
    *   Ensuring adequate line height and paragraph spacing to prevent text from feeling cramped and improve readability.

*   **Text Colors:**
    *   `--text-color-primary`: `--color-primary-blue-dark` (for main headings, essential information)
    *   `--text-color-secondary`: `--color-neutral-gray-dark` (for body text, descriptions)
    *   `--text-color-tertiary`: `--color-neutral-gray-medium` (for subtle hints, disabled text)
    *   `--text-color-inverted`: `--color-neutral-gray-light` (for text on dark backgrounds)

**4. UI/UX Principles**
The user interface and experience are designed to be intuitive, efficient, and empowering for e-commerce entrepreneurs.

*   **A. Clarity & Simplicity:**
    *   **Minimalist Design:** Employ a clean, uncluttered interface to reduce visual noise, focusing attention on critical financial data.
    *   **Intuitive Navigation:** Implement a clear and consistent navigation structure (e.g., sidebar or top bar) that allows users to easily move between sections like Dashboard, Expenses, Profits, Reports, and Settings.
    *   **Concise Labeling:** Use clear, unambiguous labels for all elements, buttons, and data points. Avoid jargon where possible.
    *   **Information Hierarchy:** Organize content logically using headings, subheadings, and distinct sections to guide the user's eye and highlight important information.

*   **B. Data Visualization & Reporting:**
    *   **Actionable Insights:** Present financial data in easily digestible formats that facilitate quick decision-making.
    *   **Clear Visuals:** Utilize straightforward charts (line graphs for trends, pie charts for breakdowns, bar charts for comparisons) and tables for displaying KPIs such as Total Revenue, Total Expenses, P&L, Profit Margin, and Cash Flow.
    *   **Interactive Elements:** Enable users to interact with charts and tables, allowing filtering by date range, category, or product, and drill-down capabilities for granular insights.
    *   **Consistency in Data Display:** Ensure that financial figures (currency, percentages) are formatted consistently across all reports and dashboards.

*   **C. User Control & Customization:**
    *   **Dark Mode:** Provide a prominent toggle for users to switch between light and dark modes, catering to individual preferences and varying lighting conditions.
    *   **Personalized Dashboards:** Allow users to customize their dashboard layouts by dragging, dropping, and resizing widgets. Users should be able to select which KPIs and report summaries are most prominent.
    *   **Custom Categories:** Empower users to create, edit, and manage custom categories for both expenses and income, aligning the app with their unique business structure and accounting needs.
    *   **Flexible Reporting:** Offer extensive options for setting custom date ranges for reports (daily, weekly, monthly, quarterly, annual, custom range) and preferences for report generation (e.g., CSV export).

*   **D. Feedback & Responsiveness:**
    *   **Timely Feedback:** Provide immediate visual or textual feedback for user actions, such as loading indicators for API calls, success messages for saved data, and clear error messages for input validation or system issues.
    *   **System Alerts:** Use accent colors and clear messaging for important alerts (e.g., "duplicate entry detected", "missing information").
    *   **Adaptive Layouts:** Design layouts that gracefully adapt to different screen sizes (desktop, tablet, mobile), ensuring optimal usability regardless of device.

*   **E. Automated Data & Approval Workflows:**
    *   **Minimal Intervention UI:** Design the automated data review interface to be highly efficient, allowing users to approve, edit, categorize, add notes, reject, or flag data entries with minimal clicks.
    *   **Conflict Resolution:** Clearly highlight discrepancies (e.g., conflicting amounts) and provide intuitive options for users to resolve them (e.g., "Merge", "Edit", "Discard").
    *   **Duplicate Detection:** Visually alert users to potential duplicate entries and offer one-click options to merge or delete.
    *   **Guidance for Missing Data:** Prompt users concisely when essential information (e.g., category, date) is missing from an automated entry, offering defaults or direct input fields.
    *   **Visual Cues:** Differentiate between automatically fetched data and manually entered data (e.g., with small icons or subtle background variations) to provide context.

*   **F. Accessibility:**
    *   **High Contrast:** Ensure sufficient color contrast ratios for text and interactive elements to meet WCAG guidelines.
    *   **Keyboard Navigation:** Support full keyboard navigation for all interactive components.
    *   **Semantic Structure:** Utilize proper HTML semantics to ensure compatibility with assistive technologies.
    *   **Clear Focus States:** Provide clear visual focus indicators for interactive elements.

By adhering to these styling and UI/UX principles, "TrackIt Ecom" will provide a professional, efficient, and user-friendly experience that simplifies financial management for e-commerce business owners.