import { describe, it, expect, vi } from 'vitest';
import { GET } from '../../src/pages/api/all-projects';

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
            data: mockProjects,
            error: null
          })
        })
      })
    })
  };
});

describe('All Projects API endpoint', () => {
  it('should return a 200 status and projects array', async () => {
    // Call the GET handler directly
    const response = await GET();
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    
    // Check structure
    expect(data).toHaveProperty('projects');
    expect(Array.isArray(data.projects)).toBe(true);
    
    // Check that we have 3 mock projects
    expect(data.projects.length).toBe(3);
    
    // Verify the structure of projects
    const project = data.projects[0];
    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('name');
    expect(project).toHaveProperty('url');
    expect(project).toHaveProperty('description');
    expect(project).toHaveProperty('username');
    expect(project).toHaveProperty('tags');
    expect(project).toHaveProperty('submitted_at');
    expect(Array.isArray(project.tags)).toBe(true);
  });
});