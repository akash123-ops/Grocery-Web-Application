import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart, currency } = useAppContext();
  const [quantity, setQuantity] = useState(1);

  // Find current product
  const product = products.find(
    (item) => item._id?.toString() === id
  );

  if (!product) {
    return (
      <div className="mt-20 text-center text-2xl font-semibold">
        Product not found
      </div>
    );
  }

  // 🔥 Related Products (same category, exclude current)
  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item._id !== product._id
    )
    .slice(0, 4);

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="mt-16 px-4 md:px-12 py-8">

      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-80 h-80 object-contain rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-xl text-green-600 font-semibold">
            {currency} {product.price}
          </p>

          <p className="text-gray-600">
            {product.description}
          </p>

          <p className="text-sm text-gray-500">
            Category: {product.category}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={decreaseQty}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <span className="text-lg font-medium">{quantity}</span>

            <button
              onClick={increaseQty}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product, quantity)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

{/* 🔥 Related Products Section */}
{relatedProducts.length > 0 && (
  <div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold">
        Related Products
      </h2>
      <div className="w-20 h-1 bg-green-600 mt-2 rounded"></div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {relatedProducts.map((item) => (
        <div
          key={item._id}
          className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <Link to={`/products/${item.category?.toLowerCase() || "all"}/${item._id}`}>
            <img
              src={Array.isArray(item.image) ? item.image[0] : item.image}
              alt={item.name}
              className="w-full h-32 object-contain mb-3"
            />
          </Link>

          <Link to={`/products/${item.category?.toLowerCase() || "all"}/${item._id}`}>
            <h3 className="font-semibold hover:text-green-600">
              {item.name}
            </h3>
          </Link>

          <p className="text-green-600 font-bold">
            {currency} {item.price}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default ProductDetail;