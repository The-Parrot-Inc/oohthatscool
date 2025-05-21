import type { APIRoute } from 'astro';
import { initializeSupabase } from '../../lib/supabase';

// Mark this endpoint as server-rendered (not static)
export const prerender = false;

// GET: Fetch all projects for the projects page
export const GET: APIRoute = async () => {
  try {
    const supabase = initializeSupabase();
    
    const { data: projects, error } = await supabase
      .from('rust_projects')
      .select('*')
      .eq('active', true)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: `Error fetching projects: ${error.message}` 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ projects }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error('Unexpected error in GET /api/all-projects:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};