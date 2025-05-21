import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '../../src/pages/api/projects';

// Mock the Supabase client module
vi.mock('../../src/lib/supabase', () => {
  const mockProjects = [
    {
      id: '1',
      name: 'Test Project 1',
      url: 'https://github.com/user/test1',
      description: 'Test description 1',
      username: 'testuser1',
      tags: ['web', 'api'],
      submitted_at: '2023-01-01T12:00:00Z'
    },
    {
      id: '2',
      name: 'Test Project 2',
      url: 'https://github.com/user/test2',
      description: 'Test description 2',
      username: 'testuser2',
      tags: ['cli', 'tool'],
      submitted_at: '2023-01-02T12:00:00Z'
    },
    {
      id: '3',
      name: 'Test Project 3',
      url: 'https://github.com/user/test3',
      description: 'Test description 3',
      username: 'testuser3',
      tags: ['library', 'async'],
      submitted_at: '2023-01-03T12:00:00Z'
    }
  ];

  return {
    initializeSupabase: () => ({
      from: () => ({
        select: () => ({
          order: () => ({
            limit: () => ({
              data: mockProjects.slice(0, 3),
              error: null
            })
          })
        }),
        insert: (newProject) => ({
          select: () => ({
            data: [{ ...newProject, id: 'new-mock-id' }],
            error: null
          })
        })
      })
    })
  };
});

describe('Projects API endpoint', () => {
  it('should return a 200 status from GET /api/projects', async () => {
    // Call the GET handler directly
    const response = await GET();
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    
    // Check structure
    expect(data).toHaveProperty('projects');
    expect(Array.isArray(data.projects)).toBe(true);
    
    // Check that we have mock projects (3)
    expect(data.projects.length).toBe(3);
    
    // Check structure of a project
    const project = data.projects[0];
    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('name');
    expect(project).toHaveProperty('url');
    expect(project).toHaveProperty('description');
    expect(project).toHaveProperty('username');
    expect(project).toHaveProperty('tags');
    expect(project).toHaveProperty('submitted_at');
    expect(Array.isArray(project.tags)).toBe(true);
    
    // Check that lastSubmission is included
    expect(data).toHaveProperty('lastSubmission');
    expect(data.lastSubmission).toBe('2023-01-01T12:00:00Z');
  });

  it('should return 400 when POST request has invalid content-type', async () => {
    // Create a mock request with invalid content type
    const mockRequest = {
      headers: {
        get: (header) => header === 'Content-Type' ? 'text/plain' : null
      }
    };
    
    // Call the POST handler directly
    const response = await POST({ request: mockRequest });
    
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Content-Type must be application/json');
  });

  it('should return 400 when POST request is missing required fields', async () => {
    // Create a mock request with missing fields
    const mockRequest = {
      headers: {
        get: (header) => header === 'Content-Type' ? 'application/json' : null
      },
      json: () => Promise.resolve({
        // Missing required fields
        name: 'Test Project',
        // Missing url, description, username, tags
      })
    };
    
    // Call the POST handler directly
    const response = await POST({ request: mockRequest });
    
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('requiredFields');
    expect(data).toHaveProperty('received');
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 201 when POST request is valid', async () => {
    const projectData = {
      name: 'Test Project',
      url: 'https://github.com/test/project',
      description: 'A test project',
      username: 'testuser',
      tags: ['test', 'api']
    };
    
    // Create a mock request with valid data
    const mockRequest = {
      headers: {
        get: (header) => header === 'Content-Type' ? 'application/json' : null
      },
      json: () => Promise.resolve(projectData)
    };
    
    // Call the POST handler directly
    const response = await POST({ request: mockRequest });
    
    expect(response.status).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('project');
    expect(data).toHaveProperty('submitted_at');
    expect(data.success).toBe(true);
    expect(data.project).toHaveProperty('id');
    
    // Check that the new project has the expected ID and data
    expect(data.project.id).toBe('new-mock-id');
    expect(data.project.name).toBe(projectData.name);
    expect(data.project.url).toBe(projectData.url);
    expect(data.project.description).toBe(projectData.description);
    expect(data.project.username).toBe(projectData.username);
    expect(Array.isArray(data.project.tags)).toBe(true);
    expect(data.project.tags).toEqual(projectData.tags);
  });
});