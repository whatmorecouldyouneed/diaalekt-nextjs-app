import { GraphQLClient, gql } from "graphql-request";

// Check if environment variables are available
const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

console.log("🔍 Environment Variables Check:", {
  shopifyDomain,
  shopifyToken: shopifyToken ? `${shopifyToken.substring(0, 10)}...` : "NOT SET",
  nodeEnv: process.env.NODE_ENV,
  allEnvKeys: Object.keys(process.env).filter(key => key.includes('SHOPIFY'))
});

if (!shopifyDomain || !shopifyToken) {
  console.error("❌ Missing Shopify environment variables:", {
    domain: shopifyDomain,
    hasToken: !!shopifyToken
  });
}

// Type definitions for Shopify response
interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  variants: {
    edges: Array<{
      node: {
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
}

interface ShopifyResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

const PRODUCTS_QUERY = gql`
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchProducts() {
  console.log("🚀 Starting fetchProducts function");
  
  // Check if we have the required environment variables
  if (!shopifyDomain || !shopifyToken) {
    console.warn("⚠️ Missing Shopify environment variables, returning mock data");
    return getMockProducts();
  }
  
  try {
    console.log("📡 Making direct request to Shopify...");
    
    const client = new GraphQLClient(`https://${shopifyDomain}/api/2023-10/graphql.json`, {
      headers: {
        'X-Shopify-Storefront-Access-Token': shopifyToken,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await client.request<ShopifyResponse>(PRODUCTS_QUERY);
    
    console.log("✅ Shopify Response Received:", data);
    
    if (!data || !data.products || !data.products.edges) {
      console.warn("⚠️ No products found in Shopify response");
      return getMockProducts();
    }

    console.log(`📦 Found ${data.products.edges.length} products`);

    const processedProducts = data.products.edges
      .map((edge, index) => {
        const product = edge.node;
        const variant = product.variants?.edges?.[0]?.node;
        const image = product.images?.edges?.[0]?.node;
        
        console.log(`🔍 Processing product ${index + 1}:`, {
          title: product.title,
          hasVariant: !!variant,
          hasImage: !!image,
          variantPrice: variant?.price?.amount
        });
        
        if (!variant || !variant.price) {
          console.warn(`⚠️ Product ${product.title} has no valid variant or price`);
          return null;
        }

        const processedProduct = {
          id: product.id,
          title: product.title,
          description: product.description || "",
          price: parseFloat(variant.price.amount),
          currencyCode: variant.price.currencyCode,
          image: transformShopifyImageUrl(image?.url),
          altText: image?.altText || product.title
        };
        
        console.log(`✅ Processed product ${index + 1}:`, processedProduct);
        
        return processedProduct;
      })
      .filter(Boolean); // Remove any null products

    console.log(`✅ Successfully processed ${processedProducts.length} products`);
    return processedProducts.length > 0 ? processedProducts : getMockProducts();
    
  } catch (error) {
    console.error("❌ Error fetching products from Shopify:", error);
    if (error instanceof Error) {
      console.error("🔍 Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    // Return mock products as fallback
    return getMockProducts();
  }
}

// Helper function to transform Shopify CDN URLs
function transformShopifyImageUrl(url: string): string {
  if (!url) return "/placeholder-product.jpg";
  
  // Since Shopify CDN URLs are already full URLs, just return as is
  return url;
}

// Mock products for fallback when Shopify is not available
function getMockProducts() {
  return [
    {
      id: "mock-1",
      title: "Handcrafted Ceramic Bowl",
      description: "Beautiful hand-thrown ceramic bowl perfect for your morning cereal or evening soup. Each piece is unique and made with love.",
      price: 45.00,
      currencyCode: "USD",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
      altText: "Handcrafted ceramic bowl"
    },
    {
      id: "mock-2", 
      title: "Artisan Wooden Cutting Board",
      description: "Premium hardwood cutting board that's both functional and beautiful. Perfect for your kitchen or as a serving platter.",
      price: 65.00,
      currencyCode: "USD",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
      altText: "Artisan wooden cutting board"
    },
    {
      id: "mock-3",
      title: "Handwoven Textile Wall Hanging",
      description: "Stunning handwoven textile that adds warmth and texture to any space. Made using traditional techniques passed down through generations.",
      price: 120.00,
      currencyCode: "USD", 
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
      altText: "Handwoven textile wall hanging"
    }
  ];
}

// Add more functions for cart mutations, etc., using similar GraphQL queries.

