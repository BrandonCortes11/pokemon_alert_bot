'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedBusiness, setSelectedBusiness] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [exporting, setExporting] = useState<string | null>(null)
  const [exportMessage, setExportMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Report types from requirements.md
  const reportTypes = [
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      description: 'Comprehensive P&L report showing revenue, expenses, and net profit',
      icon: '📊'
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Report',
      description: 'Track cash inflows and outflows over time',
      icon: '💰'
    },
    {
      id: 'expense-breakdown',
      name: 'Expense Breakdown',
      description: 'Detailed breakdown of expenses by category and time period',
      icon: '📉'
    },
    {
      id: 'product-profitability',
      name: 'Product Profitability',
      description: 'Profit analysis per product or product category',
      icon: '🛍️'
    },
    {
      id: 'sales-trends',
      name: 'Sales Trends',
      description: 'Revenue trends and sales performance over time',
      icon: '📈'
    },
    {
      id: 'integration-summary',
      name: 'Integration Summary',
      description: 'Performance summary from connected social media platforms',
      icon: '🔗'
    }
  ]

  const handleExport = async (reportId: string, format: 'pdf' | 'csv') => {
    setExporting(`${reportId}-${format}`)
    setExportMessage(null)

    try {
      // In a real app, this would generate and download the report
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const report = reportTypes.find(r => r.id === reportId)
      setExportMessage({
        type: 'success',
        text: `${report?.name} exported successfully as ${format.toUpperCase()}!`
      })
    } catch (error) {
      setExportMessage({
        type: 'error',
        text: 'Export failed. Please try again.'
      })
    } finally {
      setExporting(null)
    }
  }

  const generatePreview = () => {
    // Sample data for preview
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      transactionCount: 0
    }
  }

  const preview = generatePreview()

  return (
    <DashboardLayout
      title="Reports"
      description="Generate detailed financial reports and export data"
    >
      <div className="space-y-8">
        {exportMessage && (
          <Alert 
            variant={exportMessage.type} 
            title={exportMessage.type === 'success' ? 'Export Successful' : 'Export Failed'}
          >
            {exportMessage.text}
          </Alert>
        )}

        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <p className="text-sm text-text-secondary">
              Customize your reports with date ranges, business selection, and categories
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
              
              <Input
                label="End Date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Business
                </label>
                <select
                  value={selectedBusiness}
                  onChange={(e) => setSelectedBusiness(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200"
                >
                  <option value="all">All Businesses</option>
                  <option value="main">Main Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="advertising">Advertising Spend</option>
                  <option value="products">Product Costs</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="sales">Sales Revenue</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
            <p className="text-sm text-text-secondary">
              Based on current filters: {dateRange.startDate} to {dateRange.endDate}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-green">${preview.totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-text-secondary">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-red">${preview.totalExpenses.toFixed(2)}</div>
                <div className="text-sm text-text-secondary">Total Expenses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">${preview.netProfit.toFixed(2)}</div>
                <div className="text-sm text-text-secondary">Net Profit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-blue-medium">{preview.transactionCount}</div>
                <div className="text-sm text-text-secondary">Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.id} className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{report.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{report.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    loading={exporting === `${report.id}-pdf`}
                    onClick={() => handleExport(report.id, 'pdf')}
                    disabled={exporting !== null}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    loading={exporting === `${report.id}-csv`}
                    onClick={() => handleExport(report.id, 'csv')}
                    disabled={exporting !== null}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-text-tertiary">
                    {report.id === 'profit-loss' && 'Includes revenue, all expense categories, and profit calculations'}
                    {report.id === 'cash-flow' && 'Shows cash movements with dates and payment methods'}
                    {report.id === 'expense-breakdown' && 'Categorized expenses with percentage breakdowns'}
                    {report.id === 'product-profitability' && 'Revenue minus product costs per item'}
                    {report.id === 'sales-trends' && 'Time-based revenue analysis with growth rates'}
                    {report.id === 'integration-summary' && 'Data from Facebook, Instagram, and WhatsApp APIs'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Report Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <p className="text-sm text-text-secondary">
              Create custom reports with specific data points and formatting
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">Include Data:</h4>
                  <div className="space-y-2">
                    {[
                      'Revenue by source',
                      'Expense by category', 
                      'Transaction details',
                      'Date and time stamps',
                      'Notes and descriptions',
                      'Integration source'
                    ].map((item) => (
                      <label key={item} className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" defaultChecked />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary mb-3">Report Format:</h4>
                  <div className="space-y-2">
                    {[
                      'Summary totals',
                      'Detailed line items',
                      'Charts and graphs',
                      'Percentage breakdowns',
                      'Trend analysis',
                      'Comparison tables'
                    ].map((item) => (
                      <label key={item} className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" defaultChecked />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t">
                <Button variant="primary">
                  Generate Custom Report
                </Button>
                <Button variant="outline">
                  Save Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automated Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Automated Reports</CardTitle>
            <p className="text-sm text-text-secondary">
              Schedule automatic report generation and delivery
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-text-secondary mb-2">Coming Soon</p>
                <p className="text-sm text-text-tertiary mb-4">Schedule monthly P&L reports, weekly summaries, and more</p>
                <Button variant="outline" disabled>
                  Setup Automated Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}