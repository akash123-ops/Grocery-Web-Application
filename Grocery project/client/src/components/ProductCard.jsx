import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, currency } = useAppContext();

  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">

      <Link to={`/products/${product.category?.toLowerCase() || "all"}/${product._id}`}>
        <img
          src={Array.isArray(product.image) ? product.image[0] : product.image}
          alt={product.name}
          className="w-full h-40 object-contain"
        />
      </Link>

      <Link to={`/products/${product.category?.toLowerCase() || "all"}/${product._id}`}>
        <h3 className="mt-2 font-semibold hover:text-green-600">
          {product.name}
        </h3>
      </Link>

      <p className="text-green-600 font-bold mt-1">
        {currency} {product.price}
      </p>

      <button
        onClick={() => addToCart(product, 1)}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;