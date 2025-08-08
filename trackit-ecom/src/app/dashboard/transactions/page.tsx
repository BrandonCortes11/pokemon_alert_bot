'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'add' | 'view'>('add')
  const [transactionType, setTransactionType] = useState<'expense' | 'revenue'>('expense')
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Categories from requirements.md
  const expenseCategories = [
    'Advertising Spend',
    'Product Costs (COGS)',
    'Shipping & Delivery',
    'Transaction Fees',
    'Returns & Refunds',
    'Software Subscriptions',
    'Packaging & Handling',
    'Miscellaneous Operating'
  ]

  const revenueCategories = [
    'Sales Revenue',
    'Payment Gateway Payouts',
    'Refunds Processed (Negative)',
    'Discounts & Coupons (Negative)',
    'Other Income'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.amount || !formData.description || !formData.category) {
      setError('Please fill in all required fields')
      return
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0')
      return
    }

    try {
      // In a real app, this would save to the database
      console.log('Transaction data:', {
        type: transactionType,
        ...formData,
        amount: Number(formData.amount)
      })

      setSuccess(`${transactionType === 'expense' ? 'Expense' : 'Revenue'} entry added successfully!`)
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
    } catch (err) {
      setError('Failed to save transaction. Please try again.')
    }
  }

  return (
    <DashboardLayout
      title="Transactions"
      description="Manually add expenses and revenue entries"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-neutral-gray-light rounded-lg p-1">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'add'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Add Transaction
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'view'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            View Transactions
          </button>
        </div>

        {activeTab === 'add' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transaction Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Transaction</CardTitle>
                  <div className="flex space-x-4 mt-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="expense"
                        checked={transactionType === 'expense'}
                        onChange={(e) => setTransactionType(e.target.value as 'expense')}
                        className="mr-2"
                      />
                      <span className="text-accent-red font-medium">Expense</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="revenue"
                        checked={transactionType === 'revenue'}
                        onChange={(e) => setTransactionType(e.target.value as 'revenue')}
                        className="mr-2"
                      />
                      <span className="text-accent-green font-medium">Revenue</span>
                    </label>
                  </div>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="error" title="Error">
                      {error}
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert variant="success" title="Success">
                      {success}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        placeholder="0.00"
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        }
                      />

                      <Input
                        label="Date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <Input
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder={transactionType === 'expense' ? 'e.g., Facebook ad campaign' : 'e.g., Product sales from Instagram'}
                    />

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">
                        Category <span className="text-accent-red">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 px-4 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200"
                      >
                        <option value="">Select a category</option>
                        {(transactionType === 'expense' ? expenseCategories : revenueCategories).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange(e as any)}
                        rows={3}
                        placeholder="Additional details about this transaction..."
                        className="w-full px-4 py-3 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200 resize-none"
                      />
                    </div>

                    <Button type="submit" variant="primary" size="lg" fullWidth>
                      Add {transactionType === 'expense' ? 'Expense' : 'Revenue'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-green">$0.00</div>
                    <div className="text-sm text-text-secondary">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-red">$0.00</div>
                    <div className="text-sm text-text-secondary">Total Expenses</div>
                  </div>
                  <div className="text-center border-t pt-4">
                    <div className="text-2xl font-bold text-text-primary">$0.00</div>
                    <div className="text-sm text-text-secondary">Net Profit</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-accent-red">Expense Categories:</h4>
                    <ul className="text-xs text-text-secondary space-y-1">
                      {expenseCategories.slice(0, 4).map((cat) => (
                        <li key={cat}>• {cat}</li>
                      ))}
                      <li className="text-text-tertiary">... and {expenseCategories.length - 4} more</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'view' && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <p className="text-sm text-text-secondary">View and manage your transaction records</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-text-secondary mb-2">No transactions yet</p>
                  <p className="text-sm text-text-tertiary mb-4">Start by adding your first expense or revenue entry</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setActiveTab('add')}
                  >
                    Add Transaction
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}