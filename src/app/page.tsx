import ProductList from "@/components/ProductList";

export default function Home() {
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
        
        <ProductList />
      </div>
    </main>
  );
}

