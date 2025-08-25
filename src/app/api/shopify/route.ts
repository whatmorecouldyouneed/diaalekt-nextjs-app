import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log("🚀 Shopify API Route: Starting request");
  console.log("🔍 Request URL:", request.url);
  console.log("🔍 Request headers:", Object.fromEntries(request.headers.entries()));

  try {
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    console.log("🔍 API Route Environment Variables:", {
      shopifyDomain,
      shopifyToken: shopifyToken ? `${shopifyToken.substring(0, 10)}...` : "NOT SET",
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('SHOPIFY')),
      nodeEnv: process.env.NODE_ENV
    });

    if (!shopifyDomain || !shopifyToken) {
      console.error("❌ API Route: Missing Shopify configuration");
      return NextResponse.json(
        { error: 'Shopify configuration missing' },
        { status: 500 }
      );
    }

    const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;
    console.log("🔗 API Route: Constructed endpoint:", endpoint);

    const query = `
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

    console.log("📋 API Route: GraphQL Query:", query);
    console.log("🔑 API Route: Making request to Shopify with token:", `${shopifyToken.substring(0, 10)}...`);

    // Test basic connectivity first
    console.log("🔍 Testing basic connectivity to store...");
    try {
      const basicResponse = await fetch(`https://${shopifyDomain}`);
      console.log("✅ Basic store connectivity:", {
        status: basicResponse.status,
        ok: basicResponse.ok,
        url: basicResponse.url
      });
    } catch (error) {
      console.error("❌ Basic store connectivity failed:", error);
    }

    // Test different API versions
    const apiVersions = ['2024-01', '2023-10', '2023-07', '2023-04'];
    let workingEndpoint = null;

    for (const version of apiVersions) {
      const testEndpoint = `https://${shopifyDomain}/api/${version}/graphql.json`;
      console.log(`🔍 Testing API version ${version}: ${testEndpoint}`);
      
      try {
        const testResponse = await fetch(testEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': shopifyToken,
          },
          body: JSON.stringify({
            query: `{ shop { name } }`
          }),
        });
        
        console.log(`📡 API version ${version} response:`, {
          status: testResponse.status,
          ok: testResponse.ok,
          headers: Object.fromEntries(testResponse.headers.entries())
        });

        if (testResponse.ok) {
          workingEndpoint = testEndpoint;
          console.log(`✅ Found working API version: ${version}`);
          break;
        } else {
          const errorText = await testResponse.text();
          console.log(`❌ API version ${version} failed:`, errorText);
        }
      } catch (error) {
        console.error(`❌ API version ${version} error:`, error);
      }
    }

    if (!workingEndpoint) {
      console.error("❌ No working API version found");
      return NextResponse.json(
        { error: 'No working Shopify API version found' },
        { status: 500 }
      );
    }

    console.log("🎯 Using working endpoint:", workingEndpoint);

    const response = await fetch(workingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyToken,
      },
      body: JSON.stringify({ query }),
    });

    console.log("📡 API Route: Shopify response status:", response.status);
    console.log("📡 API Route: Shopify response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Route: Shopify API error response:", errorText);
      throw new Error(`Shopify API responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Route: Shopify API Response received, data keys:', Object.keys(data));

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ API Route: Error in Shopify API route:', error);
    if (error instanceof Error) {
      console.error('🔍 API Route: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch products from Shopify', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
