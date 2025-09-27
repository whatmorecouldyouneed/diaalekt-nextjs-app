import { GraphQLClient, gql } from "graphql-request";

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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
  if (!shopifyDomain || !shopifyToken) {
    return getMockProducts();
  }
  
  try {
    const client = new GraphQLClient(`https://${shopifyDomain}/api/2023-10/graphql.json`, {
      headers: {
        'X-Shopify-Storefront-Access-Token': shopifyToken,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await client.request<ShopifyResponse>(PRODUCTS_QUERY);
    
    if (!data || !data.products || !data.products.edges) {
      return getMockProducts();
    }

    const processedProducts = data.products.edges
      .map((edge) => {
        const product = edge.node;
        const variant = product.variants?.edges?.[0]?.node;
        const image = product.images?.edges?.[0]?.node;
        
        if (!variant || !variant.price) {
          return null;
        }

        return {
          id: product.id,
          title: product.title,
          description: product.description || "",
          price: parseFloat(variant.price.amount),
          currencyCode: variant.price.currencyCode,
          image: transformShopifyImageUrl(image?.url),
          altText: image?.altText || product.title
        };
      })
      .filter(Boolean);

    return processedProducts.length > 0 ? processedProducts : getMockProducts();
    
  } catch (error) {
    console.error("Error fetching products from Shopify:", error);
    return getMockProducts();
  }
}

function transformShopifyImageUrl(url: string): string {
  if (!url) return "/placeholder-product.jpg";
  return url;
}

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
