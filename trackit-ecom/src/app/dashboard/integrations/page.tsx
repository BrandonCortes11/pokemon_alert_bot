'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected' | 'pending'
  icon: string
  color: string
  features: string[]
  dataPoints: string[]
}

export default function IntegrationsPage() {
  const [connectingTo, setConnectingTo] = useState<string | null>(null)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Integration configurations from requirements.md
  const integrations: Integration[] = [
    {
      id: 'facebook',
      name: 'Facebook Graph API',
      description: 'Connect your Facebook Ads account to automatically track ad spend and conversions',
      status: 'disconnected',
      icon: '📘',
      color: 'bg-blue-500',
      features: [
        'Automatic ad spend tracking',
        'Campaign performance metrics',
        'Conversion tracking',
        'Audience insights'
      ],
      dataPoints: [
        'Ad spend amounts',
        'Campaign IDs and metrics', 
        'Clicks and conversions',
        'Purchase conversions'
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram Business API',
      description: 'Track engagement and ad performance from your Instagram Business account',
      status: 'disconnected',
      icon: '📷',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      features: [
        'Engagement insights',
        'Ad performance tracking',
        'Link click tracking',
        'Story metrics'
      ],
      dataPoints: [
        'Likes, comments, shares',
        'Ad performance metrics',
        'Link clicks and conversions',
        'Instagram post engagement'
      ]
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      description: 'Extract customer order data and conversation insights from WhatsApp Business',
      status: 'disconnected',
      icon: '💬',
      color: 'bg-green-500',
      features: [
        'Customer conversation tracking',
        'Order confirmation detection',
        'Inquiry-to-order conversion',
        'Transaction message parsing'
      ],
      dataPoints: [
        'Customer order details',
        'Order confirmations',
        'Inquiry conversations',
        'Transaction messages'
      ]
    }
  ]

  const handleConnect = async (integrationId: string) => {
    setConnectingTo(integrationId)
    setMessage(null)

    try {
      // In a real app, this would initiate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate connection process
      const integration = integrations.find(i => i.id === integrationId)
      setMessage({
        type: 'success',
        text: `${integration?.name} connection initiated! Please complete the OAuth authorization in the popup window.`
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to connect. Please try again.'
      })
    } finally {
      setConnectingTo(null)
    }
  }

  const getStatusBadge = (status: Integration['status']) => {
    const styles = {
      connected: 'bg-green-100 text-green-800',
      disconnected: 'bg-gray-100 text-gray-800', 
      pending: 'bg-yellow-100 text-yellow-800'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <DashboardLayout
      title="Integrations"
      description="Connect your social media accounts for automated expense and revenue tracking"
    >
      <div className="space-y-8">
        {message && (
          <Alert 
            variant={message.type} 
            title={message.type === 'success' ? 'Connection Started' : 'Connection Failed'}
          >
            {message.text}
          </Alert>
        )}

        {/* Integration Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Automated Data Collection</CardTitle>
            <p className="text-sm text-text-secondary">
              Connect your business accounts to automatically track expenses and revenue with minimal user intervention.
              Once connected, you'll simply review and approve the fetched data.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-text-primary">Automated Tracking</h4>
                <p className="text-sm text-text-secondary mt-1">Minimal user intervention required</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">✅</div>
                <h4 className="font-semibold text-text-primary">Review & Approve</h4>
                <p className="text-sm text-text-secondary mt-1">Simple approval workflow</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">📈</div>
                <h4 className="font-semibold text-text-primary">Real-time Insights</h4>
                <p className="text-sm text-text-secondary mt-1">Up-to-date financial data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Integrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {integration.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mt-2">{integration.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">Features:</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-accent-green mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary mb-3">Data Captured:</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {integration.dataPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-blue-medium mr-2 mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  {integration.status === 'connected' ? (
                    <div className="space-y-3">
                      <Button variant="success" fullWidth disabled>
                        ✓ Connected
                      </Button>
                      <Button variant="outline" size="sm" fullWidth>
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      fullWidth
                      loading={connectingTo === integration.id}
                      onClick={() => handleConnect(integration.id)}
                      disabled={connectingTo !== null}
                    >
                      {connectingTo === integration.id ? 'Connecting...' : `Connect ${integration.name.split(' ')[0]}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <p className="text-sm text-text-secondary">
              Follow these steps to connect your social media accounts
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-blue-medium text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Choose Integration</h4>
                  <p className="text-text-secondary text-sm">Select the social media platform you want to connect from the cards above.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-blue-medium text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">OAuth Authorization</h4>
                  <p className="text-text-secondary text-sm">Complete the OAuth 2.0 authorization process in the popup window to grant access to your account data.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-blue-medium text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Review & Approve Data</h4>
                  <p className="text-text-secondary text-sm">Once connected, the system will automatically fetch your data. You'll review and approve transactions before they're added to your records.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex">
                <svg className="w-5 h-5 text-amber-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h5 className="font-semibold text-amber-800">Security & Privacy</h5>
                  <p className="text-sm text-amber-700 mt-1">
                    We use OAuth 2.0 for secure authorization and only collect essential data for financial tracking. 
                    API keys are securely managed and regularly rotated for maximum security.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}