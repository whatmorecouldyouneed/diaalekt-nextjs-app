import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🔍 Debug Environment Route: Starting");
  
  const allEnvVars = process.env;
  const shopifyVars = Object.keys(allEnvVars).filter(key => key.includes('SHOPIFY'));
  
  console.log("🔍 All environment variables:", Object.keys(allEnvVars));
  console.log("🔍 Shopify-related variables:", shopifyVars);
  
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  // Test if we can actually access the environment variables
  const envTest = {
    hasShopifyDomain: !!shopifyDomain,
    hasShopifyToken: !!shopifyToken,
    shopifyDomainValue: shopifyDomain,
    shopifyTokenPreview: shopifyToken ? `${shopifyToken.substring(0, 10)}...` : null,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(allEnvVars),
    shopifyEnvKeys: shopifyVars
  };
  
  console.log("🔍 Environment test results:", envTest);
  
  return NextResponse.json({
    message: "Environment debug information",
    timestamp: new Date().toISOString(),
    environment: envTest,
    recommendations: !shopifyDomain || !shopifyToken 
      ? "Missing Shopify environment variables" 
      : "Shopify environment variables found"
  });
}
