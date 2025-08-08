'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'categories' | 'security'>('profile')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    timezone: 'UTC-5',
    currency: 'USD'
  })

  // Business profile settings
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: 'e-commerce',
    industry: 'retail',
    website: '',
    description: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  })

  // Category management
  const [customCategories, setCustomCategories] = useState<{
    expenses: string[]
    revenue: string[]
  }>({
    expenses: [],
    revenue: []
  })

  const [newCategory, setNewCategory] = useState('')
  const [categoryType, setCategoryType] = useState<'expenses' | 'revenue'>('expenses')

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // In a real app, this would update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({type: 'success', text: 'Profile updated successfully!'})
    } catch (error) {
      setMessage({type: 'error', text: 'Failed to update profile. Please try again.'})
    } finally {
      setSaving(false)
    }
  }

  const handleBusinessSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // In a real app, this would save business profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({type: 'success', text: 'Business profile saved successfully!'})
    } catch (error) {
      setMessage({type: 'error', text: 'Failed to save business profile. Please try again.'})
    } finally {
      setSaving(false)
    }
  }

  const addCustomCategory = () => {
    if (newCategory.trim()) {
      setCustomCategories(prev => ({
        ...prev,
        [categoryType]: [...prev[categoryType], newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const removeCategory = (category: string, type: 'expenses' | 'revenue') => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(c => c !== category)
    }))
  }

  const tabs = [
    { id: 'profile' as const, name: 'Profile', icon: '👤' },
    { id: 'business' as const, name: 'Business', icon: '🏢' },
    { id: 'categories' as const, name: 'Categories', icon: '📂' },
    { id: 'security' as const, name: 'Security', icon: '🔒' }
  ]

  return (
    <DashboardLayout
      title="Settings"
      description="Manage your account, business profile, and application settings"
    >
      <div className="space-y-6">
        {message && (
          <Alert 
            variant={message.type} 
            title={message.type === 'success' ? 'Success' : 'Error'}
          >
            {message.text}
          </Alert>
        )}

        {/* Settings Navigation */}
        <div className="flex space-x-1 bg-neutral-gray-light rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <p className="text-sm text-text-secondary">Update your personal details and preferences</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        required
                      />
                    </div>

                    <Input
                      label="Email Address"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      required
                      disabled
                      helperText="Contact support to change your email address"
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                          Timezone
                        </label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                          className="w-full h-12 px-4 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200"
                        >
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC-6">Central Time (UTC-6)</option>
                          <option value="UTC-7">Mountain Time (UTC-7)</option>
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                          Currency
                        </label>
                        <select
                          value={profileData.currency}
                          onChange={(e) => setProfileData({...profileData, currency: e.target.value})}
                          className="w-full h-12 px-4 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                        </select>
                      </div>
                    </div>

                    <Button type="submit" variant="primary" loading={saving}>
                      Save Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Account Type</span>
                    <span className="px-2 py-1 bg-primary-blue-light text-primary-blue-dark text-xs font-medium rounded">
                      Free Trial
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">MFA Enabled</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Yes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Email Verified</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Verified
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Business Settings */}
        {activeTab === 'business' && (
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <p className="text-sm text-text-secondary">
                Set up your business information for reports and integrations
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Business Name"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                    required
                    placeholder="Your E-commerce Store"
                  />

                  <Input
                    label="Website"
                    type="url"
                    value={businessData.website}
                    onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                    placeholder="https://yourstore.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Business Type
                    </label>
                    <select
                      value={businessData.businessType}
                      onChange={(e) => setBusinessData({...businessData, businessType: e.target.value})}
                      className="w-full h-12 px-4 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200"
                    >
                      <option value="e-commerce">E-commerce Store</option>
                      <option value="dropshipping">Dropshipping</option>
                      <option value="manufacturing">Product Manufacturing</option>
                      <option value="services">Online Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Industry
                    </label>
                    <select
                      value={businessData.industry}
                      onChange={(e) => setBusinessData({...businessData, industry: e.target.value})}
                      className="w-full h-12 px-4 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200"
                    >
                      <option value="retail">Retail</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="electronics">Electronics</option>
                      <option value="health">Health & Beauty</option>
                      <option value="food">Food & Beverage</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={businessData.description}
                    onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                    rows={3}
                    placeholder="Describe your business and products..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-neutral-gray-medium hover:border-neutral-gray-dark focus:border-primary-blue-medium focus:outline-none focus:ring-2 focus:ring-primary-blue-medium transition-all duration-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tax ID (Optional)"
                    value={businessData.taxId}
                    onChange={(e) => setBusinessData({...businessData, taxId: e.target.value})}
                    placeholder="12-3456789"
                    helperText="For tax reporting purposes"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary mb-4">Business Address</h4>
                  <div className="space-y-4">
                    <Input
                      label="Street Address"
                      value={businessData.address.street}
                      onChange={(e) => setBusinessData({
                        ...businessData,
                        address: {...businessData.address, street: e.target.value}
                      })}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={businessData.address.city}
                        onChange={(e) => setBusinessData({
                          ...businessData,
                          address: {...businessData.address, city: e.target.value}
                        })}
                      />
                      
                      <Input
                        label="State"
                        value={businessData.address.state}
                        onChange={(e) => setBusinessData({
                          ...businessData,
                          address: {...businessData.address, state: e.target.value}
                        })}
                      />
                      
                      <Input
                        label="ZIP Code"
                        value={businessData.address.zipCode}
                        onChange={(e) => setBusinessData({
                          ...businessData,
                          address: {...businessData.address, zipCode: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" loading={saving}>
                  Save Business Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Category Management */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Custom Categories</CardTitle>
                <p className="text-sm text-text-secondary">
                  Add custom expense and revenue categories for your business
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-3">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1"
                  />
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value as 'expenses' | 'revenue')}
                    className="px-3 rounded-lg border-2 border-neutral-gray-medium"
                  >
                    <option value="expenses">Expense</option>
                    <option value="revenue">Revenue</option>
                  </select>
                  <Button onClick={addCustomCategory} variant="primary">
                    Add
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-accent-red mb-2">Custom Expense Categories</h4>
                    {customCategories.expenses.length === 0 ? (
                      <p className="text-sm text-text-tertiary">No custom expense categories yet</p>
                    ) : (
                      <div className="space-y-2">
                        {customCategories.expenses.map((category, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <span className="text-sm">{category}</span>
                            <button
                              onClick={() => removeCategory(category, 'expenses')}
                              className="text-accent-red hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent-green mb-2">Custom Revenue Categories</h4>
                    {customCategories.revenue.length === 0 ? (
                      <p className="text-sm text-text-tertiary">No custom revenue categories yet</p>
                    ) : (
                      <div className="space-y-2">
                        {customCategories.revenue.map((category, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">{category}</span>
                            <button
                              onClick={() => removeCategory(category, 'revenue')}
                              className="text-accent-green hover:text-green-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Categories</CardTitle>
                <p className="text-sm text-text-secondary">
                  Standard categories based on e-commerce best practices
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-accent-red mb-2">Expense Categories</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Advertising Spend</li>
                      <li>• Product Costs (COGS)</li>
                      <li>• Shipping & Delivery</li>
                      <li>• Transaction Fees</li>
                      <li>• Software Subscriptions</li>
                      <li>• Packaging & Handling</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent-green mb-2">Revenue Categories</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Sales Revenue</li>
                      <li>• Payment Gateway Payouts</li>
                      <li>• Refunds Processed</li>
                      <li>• Discounts & Coupons</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <p className="text-sm text-text-secondary">
                  Manage your account security and authentication settings
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-text-primary">Multi-Factor Authentication</h4>
                    <p className="text-sm text-text-secondary">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-text-primary">Change Password</h4>
                    <p className="text-sm text-text-secondary">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-text-primary">API Keys</h4>
                    <p className="text-sm text-text-secondary">Manage integration API keys</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-text-primary">Data Export</h4>
                    <p className="text-sm text-text-secondary">Download your data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-text-primary">Delete Account</h4>
                    <p className="text-sm text-text-secondary">Permanently delete your account</p>
                  </div>
                  <Button variant="error" size="sm">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}