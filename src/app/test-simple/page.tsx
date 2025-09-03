"use client";

import { useEffect, useState } from "react";

export default function TestSimplePage() {
  const [status, setStatus] = useState<string>("Loading...");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function test() {
      try {
        setStatus("Testing API call...");
        console.log("🧪 Simple Test: Starting API call");
        
        const response = await fetch('/api/shopify');
        console.log("🧪 Simple Test: Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log("🧪 Simple Test: Response data:", responseData);
        
        setData(responseData);
        setStatus("Success! Check console for details.");
        
      } catch (error) {
        console.error("🧪 Simple Test: Error:", error);
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    test();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4">Simple API Test</h1>
        <p className="text-gray-600 mb-4">Status: {status}</p>
        
        {data && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Response Data:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          Check the browser console for detailed logs.
        </div>
      </div>
    </div>
  );
}
