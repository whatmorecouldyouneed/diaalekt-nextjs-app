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
  
  try {
    console.log("📡 Making request to Next.js API route...");
    
    const response = await fetch('/api/shopify');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as ShopifyResponse;
    
    console.log("✅ Shopify Response Received:", data);
    
    if (!data.products || !data.products.edges) {
      console.warn("⚠️ No products found in Shopify response");
      return [];
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

        return {
          id: product.id,
          title: product.title,
          description: product.description || "",
          price: parseFloat(variant.price.amount),
          currencyCode: variant.price.currencyCode,
          image: image?.url || "/placeholder-product.jpg", // Fallback image
          altText: image?.altText || product.title
        };
      })
      .filter(Boolean); // Remove any null products

    console.log(`✅ Successfully processed ${processedProducts.length} products`);
    return processedProducts;
    
  } catch (error) {
    console.error("❌ Error fetching products from Shopify:", error);
    if (error instanceof Error) {
      console.error("🔍 Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

// Add more functions for cart mutations, etc., using similar GraphQL queries.

