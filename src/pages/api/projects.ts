import type { APIRoute } from 'astro';
import { initializeSupabase } from '../../lib/supabase';

// Mark this endpoint as server-rendered (not static)
export const prerender = false;

/**
 * GET: Fetch the three most recent projects and the latest submitted_at timestamp
 * Returns:
 * - 200: Successful response with projects and lastSubmission
 * - 500: Server error
 */
export const GET: APIRoute = async () => {
  console.log('[API] GET /api/projects - Request received');
  
  try {
    console.log('[API] Initializing Supabase client...');
    const supabase = initializeSupabase();
    console.log('[API] Supabase client initialized successfully');
    
    console.log('[API] Fetching projects from Supabase...');
    const { data: projects, error } = await supabase
      .from('rust_projects')
      .select('*')
      .eq('active', true)
      .order('submitted_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('[API] Error fetching projects:', error);
      return new Response(
        JSON.stringify({ 
          error: `Error fetching projects: ${error.message}` 
        }), 
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }
    
    // Get the latest submission timestamp
    let lastSubmission = null;
    if (projects && projects.length > 0) {
      lastSubmission = projects[0].submitted_at;
      console.log(`[API] Found ${projects.length} projects, latest submission: ${lastSubmission}`);
    } else {
      console.log('[API] No projects found in database');
    }
    
    console.log('[API] Sending successful GET response');
    return new Response(
      JSON.stringify({ 
        projects, 
        lastSubmission 
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
  } catch (err) {
    console.error('[API] Unexpected error in GET /api/projects:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error' 
      }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
};

/**
 * POST: Accept project submission and insert into database
 * Required fields in request body: name, url, description, username, tags
 * Returns:
 * - 201: Created - Successfully inserted project
 * - 400: Bad request - Missing or invalid fields
 * - 500: Server error
 */
export const POST: APIRoute = async ({ request }) => {
  console.log('[API] POST /api/projects - Request received');
  
  try {
    // Validate Content-Type header
    const contentType = request.headers.get('Content-Type');
    console.log(`[API] Content-Type header: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('[API] Invalid Content-Type header');
      return new Response(
        JSON.stringify({ 
          error: 'Content-Type must be application/json' 
        }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }
    
    // Parse the request body first
    let projectData;
    try {
      projectData = await request.json();
      console.log('[API] Request body parsed successfully:', projectData);
    } catch (error) {
      console.error('[API] Error parsing request JSON:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body' 
        }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }
    
    console.log('[API] Initializing Supabase client...');
    const supabase = initializeSupabase();
    console.log('[API] Supabase client initialized successfully');
    
    // Validate required fields
    const { name, url, description, username, tags } = projectData;
    
    if (!name || !url || !description || !username || !tags || tags.length === 0) {
      console.warn('[API] Missing required fields in request');
      
      const received = {
        name: Boolean(name),
        url: Boolean(url),
        description: Boolean(description),
        username: Boolean(username),
        tags: tags ? (tags.length > 0 ? true : 'empty array') : false
      };
      
      console.log('[API] Received fields:', received);
      
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          requiredFields: ['name', 'url', 'description', 'username', 'tags'],
          received
        }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }
    
    // Create the project entry with current timestamp
    const submitted_at = new Date().toISOString();
    const newProject = {
      name,
      url,
      description,
      username,
      tags,
      submitted_at,
      active: true
    };
    
    console.log('[API] Inserting new project into Supabase:', newProject);
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('rust_projects')
      .insert(newProject)
      .select();
    
    if (error) {
      console.error('[API] Error saving project to Supabase:', error);
      return new Response(
        JSON.stringify({ 
          error: `Error saving project: ${error.message}` 
        }), 
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }
    
    console.log('[API] Project successfully inserted, returning 201 Created');
    return new Response(
      JSON.stringify({ 
        success: true, 
        project: data[0],
        submitted_at
      }), 
      { 
        status: 201,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (err) {
    console.error('[API] Unexpected error in POST /api/projects:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error' 
      }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
};