import ProductList from "@/components/ProductList";
import { fetchProducts } from "@/lib/shopify";

export default async function Home() {
  // Fetch products at build time for static generation
  const products = await fetchProducts();
  
  // Filter out any null values and ensure type safety
  const validProducts = products.filter((product): product is NonNullable<typeof product> => product !== null);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Diaalekt Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover unique, handcrafted pieces that tell a story. Each item is carefully selected for its quality, craftsmanship, and character.
          </p>
        </div>
        
        <ProductList initialProducts={validProducts} />
      </div>
    </main>
  );
}

