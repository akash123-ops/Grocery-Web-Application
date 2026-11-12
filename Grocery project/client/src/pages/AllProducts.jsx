import React from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {

    const { products, searchQuery } = useAppContext();

    // Filter products based on search query
    const filteredProducts = products.filter((product) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className='mt-16'>
        {/* Header */}
        <div className='mb-8'>
            <h1 className='text-3xl font-semibold text-gray-800'>All Products</h1>
            <p className='text-gray-500 mt-2'>{filteredProducts.length} products available</p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        ) : (
            <div className='text-center py-20'>
                <p className='text-xl text-gray-500'>No products found</p>
            </div>
        )}
    </div>
  )
}

export default AllProducts
