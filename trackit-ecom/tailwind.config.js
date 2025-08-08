/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Calming & Professional)
        'primary-blue-dark': '#2C3E50',
        'primary-blue-medium': '#3498DB', 
        'primary-blue-light': '#ECF0F1',
        // Neutral Colors
        'neutral-gray-dark': '#7F8C8D',
        'neutral-gray-medium': '#BDC3C7',
        'neutral-gray-light': '#F2F4F7',
        // Accent Colors
        'accent-green': '#27AE60',
        'accent-red': '#E74C3C',
        'accent-orange': '#F39C12',
        'accent-purple': '#8E44AD',
        // Background Colors
        'background': '#FFFFFF',
        'background-dark': '#1A202C',
        'card-background-dark': '#2D3748',
        // Text Colors
        'text-primary': '#2C3E50',
        'text-secondary': '#7F8C8D',
        'text-tertiary': '#BDC3C7',
        'text-inverted': '#F2F4F7',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Open Sans', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes per requirements
        'h1': ['36px', { lineHeight: '1.2' }],
        'h2': ['28px', { lineHeight: '1.2' }],
        'h3': ['22px', { lineHeight: '1.2' }],
        'h4': ['18px', { lineHeight: '1.2' }],
        'body-large': ['16px', { lineHeight: '1.6' }],
        'body-medium': ['14px', { lineHeight: '1.6' }],
        'body-small': ['12px', { lineHeight: '1.6' }],
        'button': ['16px', { lineHeight: '1.6' }],
        'input': ['16px', { lineHeight: '1.6' }],
      },
    },
  },
}