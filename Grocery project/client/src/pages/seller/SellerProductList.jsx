import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const SellerProductList = () => {
  const { products, isLoading } = useAppContext();

  // Filter seller products - assume all for now
  const sellerProducts = products || [];

  const fallbackProducts = [
    {
      _id: 'demo1',
      name: 'Amul Milk',
      category: 'Dairy',
      offerPrice: 50,
      inStock: true,
      image: assets.amul_milk_image
    },
    {
      _id: 'demo2',
      name: 'Fresh Apple',
      category: 'Fruits',
      offerPrice: 100,
      inStock: false,
      image: assets.apple_image
    },
    {
      _id: 'demo3',
      name: 'Paneer',
      category: 'Dairy',
      offerPrice: 300,
      inStock: true,
      image: assets.paneer_image
    }
  ];

  const displayProducts = sellerProducts.length > 0 ? sellerProducts : fallbackProducts;

  if (isLoading) {
    return (
      <div className="flex-1 py-10 flex flex-col justify-between">
        <div className="w-full md:p-10 p-4 flex justify-center items-center h-64">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">All Products</h2>
          <Link
            to="/seller"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 text-sm"
          >
            + Add New Product
          </Link>
        </div>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          {displayProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products yet. <Link to="/seller" className="text-indigo-500 underline">Add your first product</Link>
            </div>
          ) : (
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold truncate">Product</th>
                  <th className="px-4 py-3 font-semibold truncate">Category</th>
                  <th className="px-4 py-3 font-semibold truncate hidden md:block">Price</th>
                  <th className="px-4 py-3 font-semibold truncate">Stock</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {displayProducts.map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20 hover:bg-gray-50">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded overflow-hidden">
                        <img
                          src={product.image || assets.amul_milk_image}
                          alt={product.name}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                      <span className="truncate font-medium text-gray-900 max-sm:hidden w-full">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{product.category}</td>
                    <td className="px-4 py-3 max-sm:hidden font-semibold text-gray-900">
                      ₹{product.offerPrice?.toLocaleString() || product.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.inStock}
                          readOnly
                        />
                        <div className={`w-12 h-7 rounded-full transition-colors duration-200 ${product.inStock ? 'bg-green-600' : 'bg-slate-300'}`}></div>
                        <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${product.inStock ? 'translate-x-5' : ''}`}></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductList;

