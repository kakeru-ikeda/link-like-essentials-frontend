import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './constants/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // StyleType colors
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-purple-500',
    // LimitedType colors
    'bg-gray-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-green-400',
    'bg-blue-400',
    'bg-orange-500',
    'bg-cyan-400',
    'bg-red-600',
    'bg-red-400',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-yellow-600',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};

export default config;
