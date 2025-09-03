"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  currencyCode: string;
  altText: string;
}

export default function ProductListSimple() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      console.log("🔄 ProductListSimple: Starting to load products");
      try {
        const response = await fetch('/api/shopify');
        console.log("🔄 ProductListSimple: API response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log("🔄 ProductListSimple: Raw API response:", responseData);
        
        // Extract the data from the response wrapper
        const data = responseData.data;
        console.log("🔄 ProductListSimple: Extracted data:", data);
        
        if (!data || !data.products || !data.products.edges) {
          throw new Error("No products found in response");
        }
        
        const processedProducts = data.products.edges
          .map((edge: any, index: number) => {
            const product = edge.node;
            const variant = product.variants?.edges?.[0]?.node;
            const image = product.images?.edges?.[0]?.node;
            
            console.log(`🔄 ProductListSimple: Processing product ${index + 1}:`, {
              title: product.title,
              hasVariant: !!variant,
              hasImage: !!image,
              variantPrice: variant?.price?.amount
            });
            
            if (!variant || !variant.price) {
              console.warn(`⚠️ Product ${product.title} has no valid variant or price`);
              return null;
            }

            return {
              id: product.id,
              title: product.title,
              description: product.description || "",
              price: parseFloat(variant.price.amount),
              currencyCode: variant.price.currencyCode,
              image: image?.url || "/placeholder-product.jpg",
              altText: image?.altText || product.title
            };
          })
          .filter(Boolean);
        
        console.log("🔄 ProductListSimple: Processed products:", processedProducts);
        setProducts(processedProducts);
        
      } catch (err) {
        console.error("❌ ProductListSimple: Error loading products:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        console.log("🏁 ProductListSimple: Loading finished");
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={products[0].image} 
              alt={products[0].altText || products[0].title} 
              className="w-full h-96 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {products[0].title}
            </h2>
            {products[0].description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {products[0].description}
              </p>
            )}
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {products[0].currencyCode} {products[0].price}
              </span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4 text-gray-600">
        Found {products.length} product(s)
      </div>
    </div>
  );
}
