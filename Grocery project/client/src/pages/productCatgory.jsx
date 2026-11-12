import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  // Decode URL (important if category has space)
  const decodedCategory = decodeURIComponent(category).toLowerCase();

  // Find category details from assets
  const selectedCategory = categories.find(
    (item) => item.path.toLowerCase() === decodedCategory
  );

  // Filter products safely
  const filteredProducts = products.filter(
    (product) =>
      product.category &&
      product.category.toLowerCase() === decodedCategory
  );

  return (
    <div className="mt-16 min-h-[70vh]">

      {/* Category Title */}
      {selectedCategory && (
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {selectedCategory.text}
          </h1>
          <div className="w-16 h-1 bg-primary mt-2 rounded"></div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-xl text-primary font-medium">
            No products found in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;