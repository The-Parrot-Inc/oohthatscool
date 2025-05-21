import { createClient } from '@supabase/supabase-js';

/**
 * Initialize the Supabase client (server-side only).
 * This function should only be used in server-side code (API routes, SSR).
 * 
 * @returns The initialized Supabase client or null if credentials are missing
 */
export function initializeSupabase() {
  console.log('[Supabase] Initializing Supabase client');
  
  // Use process.env for server-side environments, fallback to import.meta.env for build compatibility
  const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
  
  // Log environment variable presence (not values for security)
  console.log(`[Supabase] Environment variables check:
    - SUPABASE_URL: ${supabaseUrl ? 'Present' : 'Missing'}
    - SUPABASE_ANON_KEY: ${supabaseKey ? 'Present' : 'Missing'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('[Supabase] Missing required environment variables. Using mock client for build process.');
    // Return a mock client during build to prevent build failures
    // This is for static site generation purposes only
    return {
      from: () => ({
        select: () => ({
          order: () => ({
            limit: () => ({
              data: [],
              error: null
            })
          })
        }),
        insert: () => ({
          select: () => ({
            data: [{ id: 'mock-id', submitted_at: new Date().toISOString() }],
            error: null
          })
        })
      })
    };
  }
  
  console.log('[Supabase] Creating Supabase client with provided credentials');
  
  try {
    const client = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase] Client created successfully');
    return client;
  } catch (error) {
    console.error('[Supabase] Error creating Supabase client:', error);
    throw error;
  }
}