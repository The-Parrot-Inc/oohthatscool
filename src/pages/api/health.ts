import type { APIRoute } from 'astro';

/**
 * GET: Health check endpoint
 * Returns:
 * - 200: API is working correctly
 */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ 
      status: 'ok',
      message: 'API is healthy',
      timestamp: new Date().toISOString()
    }), 
    { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  );
};