import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🧪 Test Store Route: Starting");
  
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  if (!shopifyDomain || !shopifyToken) {
    return NextResponse.json({
      error: "Missing Shopify credentials",
      domain: shopifyDomain,
      hasToken: !!shopifyToken
    });
  }

  const results = [];

  // Test 1: Basic store connectivity
  try {
    console.log("🔍 Test 1: Basic store connectivity");
    const storeResponse = await fetch(`https://${shopifyDomain}`);
    results.push({
      test: "Basic store connectivity",
      url: `https://${shopifyDomain}`,
      status: storeResponse.status,
      success: storeResponse.ok,
      error: storeResponse.ok ? null : `HTTP ${storeResponse.status}`
    });
  } catch (error) {
    results.push({
      test: "Basic store connectivity",
      url: `https://${shopifyDomain}`,
      status: "ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  // Test 2: Store with www prefix
  try {
    console.log("🔍 Test 2: Store with www prefix");
    const wwwResponse = await fetch(`https://www.${shopifyDomain}`);
    results.push({
      test: "Store with www prefix",
      url: `https://www.${shopifyDomain}`,
      status: wwwResponse.status,
      success: wwwResponse.ok,
      error: wwwResponse.ok ? null : `HTTP ${wwwResponse.status}`
    });
  } catch (error) {
    results.push({
      test: "Store with www prefix",
      url: `https://www.${shopifyDomain}`,
      status: "ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  // Test 3: Try different API endpoint format
  try {
    console.log("🔍 Test 3: Different API endpoint format");
    const apiResponse = await fetch(`https://${shopifyDomain}/api/2024-01/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyToken,
      },
      body: JSON.stringify({
        query: `{ shop { name } }`
      }),
    });
    results.push({
      test: "API endpoint without .json",
      url: `https://${shopifyDomain}/api/2024-01/graphql`,
      status: apiResponse.status,
      success: apiResponse.ok,
      error: apiResponse.ok ? null : `HTTP ${apiResponse.status}`
    });
  } catch (error) {
    results.push({
      test: "API endpoint without .json",
      url: `https://${shopifyDomain}/api/2024-01/graphql`,
      status: "ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  // Test 4: Check if it's a custom domain
  try {
    console.log("🔍 Test 4: Check for custom domain");
    const customDomain = shopifyDomain.replace('.myshopify.com', '');
    const customResponse = await fetch(`https://${customDomain}.com`);
    results.push({
      test: "Custom domain check",
      url: `https://${customDomain}.com`,
      status: customResponse.status,
      success: customResponse.ok,
      error: customResponse.ok ? null : `HTTP ${customResponse.status}`
    });
  } catch (error) {
    results.push({
      test: "Custom domain check",
      url: `https://${customDomain}.com`,
      status: "ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  console.log("✅ Store tests completed, results:", results);
  
  return NextResponse.json({
    message: "Store connectivity tests completed",
    results,
    recommendations: results.filter(r => r.success).length > 0 
      ? "Found working store URLs above" 
      : "No working store URLs found - check domain configuration"
  });
}
