"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/shopify";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  currencyCode: string;
  altText: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Debug effect to log products state changes
  useEffect(() => {
    console.log("🔍 ProductList: Products state updated:", {
      productsLength: products.length,
      products: products,
      loading: loading,
      currentProductIndex: currentProductIndex
    });
  }, [products, loading, currentProductIndex]);

  useEffect(() => {
    async function loadProducts() {
      console.log("🔄 ProductList: Starting to load products");
      try {
        const data = await fetchProducts();
        console.log("✅ ProductList: Products loaded successfully:", data);
        console.log("🔍 ProductList: Data type:", typeof data);
        console.log("🔍 ProductList: Data length:", Array.isArray(data) ? data.length : 'not an array');
        console.log("🔍 ProductList: First product:", data[0]);
        setProducts(data as Product[]);
      } catch (error) {
        console.error("❌ ProductList: Error loading products:", error);
        setProducts([]);
      } finally {
        console.log("🏁 ProductList: Loading finished");
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const goToNext = () => {
    if (products.length === 0) return;
    setCurrentProductIndex((prev) => 
      prev === products.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    if (products.length === 0) return;
    setCurrentProductIndex((prev) => 
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  const goToProduct = (index: number) => {
    setCurrentProductIndex(index);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <div className="text-6xl mb-4">🍪</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Products in Oven
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Come back soon! We're crafting something special for you.
          </p>
          <div className="text-sm text-gray-500">
            Our team is working hard to bring you amazing products
          </div>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentProductIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Product Display */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img 
              src={currentProduct.image} 
              alt={currentProduct.altText || currentProduct.title} 
              className="w-full h-96 md:h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentProduct.title}
            </h2>
            
            {currentProduct.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentProduct.description}
              </p>
            )}
            
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${currentProduct.price.toFixed(2)}
              </span>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={goToPrevious}
          disabled={products.length <= 1}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        {/* Product Indicators */}
        <div className="flex space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToProduct(index)}
              className={`w-3 h-3 rounded-full transition duration-200 ${
                index === currentProductIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={goToNext}
          disabled={products.length <= 1}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Product Counter */}
      <div className="text-center mt-4 text-gray-600">
        {currentProductIndex + 1} of {products.length}
      </div>
    </div>
  );
}

