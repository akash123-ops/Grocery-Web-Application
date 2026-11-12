import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

export const BestSeller = () => {
  const {products} = useAppContext();
  
  const bestSellingProducts = products && products.length > 0 
    ? products.filter((product) => product.inStock).slice(0, 5)
    : [];

  return (
    <div className='mt-16'>
        <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6'>
          {bestSellingProducts.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
    </div>
  )
}
export default BestSeller