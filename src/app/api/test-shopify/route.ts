import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🧪 Test Shopify API Route: Starting");
  
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  if (!shopifyDomain || !shopifyToken) {
    return NextResponse.json({
      error: "Missing Shopify credentials",
      domain: shopifyDomain,
      hasToken: !!shopifyToken
    });
  }

  const endpoints = [
    // Storefront API endpoints
    `https://${shopifyDomain}/api/2024-01/graphql.json`,
    `https://${shopifyDomain}/api/2023-10/graphql.json`,
    `https://${shopifyDomain}/api/2023-07/graphql.json`,
    
    // Admin API endpoints (different token needed)
    `https://${shopifyDomain}/admin/api/2024-01/products.json`,
    `https://${shopifyDomain}/admin/api/2023-10/products.json`,
    
    // REST API endpoints
    `https://${shopifyDomain}/admin/api/2024-01/shop.json`,
    `https://${shopifyDomain}/admin/api/2023-10/shop.json`,
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testing endpoint: ${endpoint}`);
      
      let headers: any = {};
      let method = 'GET';
      let body = undefined;
      
      // For GraphQL endpoints, use POST with query
      if (endpoint.includes('graphql')) {
        method = 'POST';
        headers = {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyToken,
        };
        body = JSON.stringify({
          query: `{ shop { name } }`
        });
      } else if (endpoint.includes('/admin/')) {
        // For admin endpoints, we'd need admin access token
        headers = {
          'X-Shopify-Access-Token': shopifyToken, // This might not work with storefront token
        };
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body,
      });

      const status = response.status;
      const contentType = response.headers.get('content-type');
      
      console.log(`📡 ${endpoint}: Status ${status}, Content-Type: ${contentType}`);
      
      results.push({
        endpoint,
        status,
        contentType,
        success: status < 400,
        error: status >= 400 ? `HTTP ${status}` : null
      });

    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      results.push({
        endpoint,
        status: 'ERROR',
        contentType: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  console.log("✅ Test completed, results:", results);
  
  return NextResponse.json({
    message: "Shopify API endpoint test completed",
    results,
    recommendations: results.filter(r => r.success).length > 0 
      ? "Found working endpoints above" 
      : "No working endpoints found - check Shopify configuration"
  });
}
