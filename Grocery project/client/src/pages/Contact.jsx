import React from 'react'

const Contact = () => {
  return (
    <div className='min-h-screen py-20 px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center'>Contact Us</h1>
        <p className='text-xl text-gray-600 mb-16 text-center'>Get in touch with us for any queries about our grocery services.</p>
        
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-xl text-gray-900'>Phone</h3>
                <p className='text-gray-600'>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.27 7.27c.883.883 2.317.883 3.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-xl text-gray-900'>Email</h3>
                <p className='text-gray-600'>hello@groceryapp.com</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-xl text-gray-900'>Address</h3>
                <p className='text-gray-600'>123 Grocery Street, Food City, FC 12345</p>
              </div>
            </div>
          </div>

          <form className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
              <input type='text' className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent' placeholder='Your name' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
              <input type='email' className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent' placeholder='your@email.com' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Message</label>
              <textarea rows={5} className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical' placeholder='Your message' />
            </div>
            <button type='submit' className='w-full bg-primary hover:bg-primary-dull text-white font-medium py-3 px-6 rounded-xl transition duration-200'>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact

