import React from 'react'
import { assets, features } from '../assets/assets'

export const BottomBanner = () => {
  return (
    <div className='relative mt-24'>
        <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden lg:block'/>
        <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full block lg:hidden'/>

        <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24 px-4'>
            <div className='w-full max-w-md md:max-w-lg'>
                <h1 className='text-2xl md:text-4xl font-semibold text-primary mb-8 text-center md:text-left'>Why Are the Best?</h1>
                <div className='space-y-6'>
                    {features.map((feature, index) => (
                        <div key={index} className='flex flex-col md:flex-row items-center md:items-start gap-4'>
                            <img src={feature.image} alt={feature.title} className='w-16 h-16 flex-shrink-0'/>
                            <div className='text-center md:text-left'>
                                <h3 className='text-lg md:text-xl font-semibold text-gray-800'>{feature.title}</h3>
                                <p className='text-gray-500/70 text-sm md:text-base mt-1'>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}
