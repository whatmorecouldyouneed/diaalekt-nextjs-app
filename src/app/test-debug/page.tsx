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

export default function TestDebugPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testFetch() {
      console.log("🧪 Test Debug: Starting test fetch");
      try {
        const response = await fetch('/api/shopify');
        console.log("🧪 Test Debug: API response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log("🧪 Test Debug: Raw API response:", responseData);
        
        // Extract the data from the response wrapper
        const data = responseData.data;
        console.log("🧪 Test Debug: Extracted data:", data);
        
        if (!data || !data.products || !data.products.edges) {
          throw new Error("No products found in response");
        }
        
        const processedProducts = data.products.edges
          .map((edge: any, index: number) => {
            const product = edge.node;
            const variant = product.variants?.edges?.[0]?.node;
            const image = product.images?.edges?.[0]?.node;
            
            console.log(`🧪 Test Debug: Processing product ${index + 1}:`, {
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
        
        console.log("🧪 Test Debug: Processed products:", processedProducts);
        setProducts(processedProducts);
        
      } catch (err) {
        console.error("🧪 Test Debug: Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    
    testFetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Testing product fetch...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Test Results</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Products Found: {products.length}</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
        
        {products.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
