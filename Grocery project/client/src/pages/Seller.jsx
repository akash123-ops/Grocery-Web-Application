import React from 'react';
import { Link } from 'react-router-dom';

const quickActions = [
  {
    title: 'Seller Login',
    description: 'Access your storefront dashboard and manage your business.',
    href: '/seller-login',
    accent: 'bg-primary/10 text-primary',
    badge: 'Secure'
  },
  {
    title: 'Add Product',
    description: 'Upload fresh grocery items, pricing, and product details.',
    href: '/seller-dashboard',
    accent: 'bg-emerald-100 text-emerald-700',
    badge: 'New'
  },
  {
    title: 'Manage Products',
    description: 'Update stock levels, pricing, and listing visibility.',
    href: '/seller-dashboard',
    accent: 'bg-amber-100 text-amber-700',
    badge: 'Live'
  },
  {
    title: 'Orders',
    description: 'Track customer orders and keep fulfillment moving.',
    href: '/seller-dashboard',
    accent: 'bg-sky-100 text-sky-700',
    badge: 'Today'
  },
  {
    title: 'Sales Overview',
    description: 'Review revenue, growth trends, and best-performing items.',
    href: '/seller-dashboard',
    accent: 'bg-violet-100 text-violet-700',
    badge: 'Insights'
  }
];

const stats = [
  { label: 'Revenue', value: 'Rs.24.8k', trend: '+12.4%' },
  { label: 'Orders', value: '386', trend: '+18.2%' },
  { label: 'Products', value: '142', trend: '+9 items' },
  { label: 'Customers', value: '1.2k', trend: '+6.1%' }
];

const topProducts = [
  { name: 'Organic Bananas', sold: '184 sold', revenue: 'Rs.1,380' },
  { name: 'Fresh Milk', sold: '162 sold', revenue: 'Rs.1,120' },
  { name: 'Spinach Pack', sold: '134 sold', revenue: 'Rs960' },
  { name: 'Brown Rice', sold: '118 sold', revenue: 'Rs740' }
];

const Seller = () => {
  return (
    <div className='min-h-screen bg-gray-50 px-4 py-6 md:px-8 md:py-10 lg:px-12'>
      <div className='mx-auto max-w-7xl'>
        <div className='rounded-[28px] border border-gray-200 bg-gradient-to-r from-primary/10 via-white to-emerald-50 p-6 shadow-sm md:p-8 lg:p-10'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <span className='inline-flex items-center rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>Seller Hub</span>
              <h1 className='mt-4 text-3xl font-bold text-gray-900 md:text-4xl'>Grow your grocery business with one simple dashboard.</h1>
              <p className='mt-3 text-base text-gray-600 md:text-lg'>Manage inventory, track orders, and monitor sales from one place built for modern grocery sellers.</p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link to='/seller-login' className='inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dull'>Seller Login</Link>
              <Link to='/seller-dashboard' className='inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary'>Open Dashboard</Link>
            </div>
          </div>
        </div>

        <div className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {stats.map((stat) => (
            <div key={stat.label} className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
              <p className='text-sm text-gray-500'>{stat.label}</p>
              <div className='mt-3 flex items-end justify-between'>
                <h3 className='text-2xl font-bold text-gray-900'>{stat.value}</h3>
                <span className='text-xs font-semibold text-primary'>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5'>
          {quickActions.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className='group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
            >
              <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${item.accent}`}>
                {item.badge}
              </div>
              <h3 className='mt-4 text-lg font-semibold text-gray-900'>{item.title}</h3>
              <p className='mt-2 text-sm leading-6 text-gray-600'>{item.description}</p>
              <span className='mt-4 inline-flex items-center text-sm font-medium text-primary'>View section →</span>
            </Link>
          ))}
        </div>

        <div className='mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]'>
          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>Top Selling Products</h2>
              <span className='text-sm text-gray-500'>This week</span>
            </div>

            <div className='mt-5 space-y-4'>
              {topProducts.map((product) => (
                <div key={product.name} className='flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3'>
                  <div>
                    <p className='font-medium text-gray-900'>{product.name}</p>
                    <p className='text-sm text-gray-500'>{product.sold}</p>
                  </div>
                  <span className='text-sm font-semibold text-primary'>{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6'>
            <h2 className='text-xl font-semibold text-gray-900'>Seller Workflow</h2>
            <div className='mt-5 space-y-4'>
              {[
                'Login to your seller account',
                'Add new products with pricing and images',
                'Manage stock and keep products updated',
                'Fulfill customer orders and review sales trends'
              ].map((step, index) => (
                <div key={step} className='flex items-start gap-3'>
                  <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white'>
                    {index + 1}
                  </div>
                  <p className='pt-1 text-sm text-gray-600'>{step}</p>
                </div>
              ))}
            </div>

            <Link to='/seller-login' className='mt-6 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700'>Start Selling</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
