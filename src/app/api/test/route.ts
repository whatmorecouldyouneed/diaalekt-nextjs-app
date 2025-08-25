import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🧪 Test API Route: Starting");
  
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  console.log("🔍 Test API Route Environment Variables:", {
    shopifyDomain,
    shopifyToken: shopifyToken ? `${shopifyToken.substring(0, 10)}...` : "NOT SET",
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('SHOPIFY')),
    nodeEnv: process.env.NODE_ENV
  });

  return NextResponse.json({
    message: "Test API route working",
    environment: {
      shopifyDomain,
      hasShopifyToken: !!shopifyToken,
      nodeEnv: process.env.NODE_ENV
    }
  });
}
