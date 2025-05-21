import React, { useState, useEffect } from 'react';

type Project = {
  name: string;
  url: string;
  description: string;
  username: string;
  tags: string[];
  submitted_at: string;
};

type ProjectsListProps = {
  limit?: number;
};

export default function ProjectsList({ limit = 3 }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Fetch the most recent projects from the API
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const displayProjects = projects.slice(0, limit);
  
  if (loading) {
    return <ul className="space-y-2 text-sm"><li className="text-muted-foreground">Loading projects...</li></ul>;
  }
  
  if (error) {
    return <ul className="space-y-2 text-sm"><li className="text-muted-foreground">Error loading projects: {error}</li></ul>;
  }
  
  if (displayProjects.length === 0) {
    return <ul className="space-y-2 text-sm"><li className="text-muted-foreground">No recent projects</li></ul>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {displayProjects.map((project, index) => {
        const projectDate = new Date(project.submitted_at);
        
        return (
          <li key={`${project.name}-${index}`} className="pb-2 border-b border-border last:border-0 last:pb-0">
            <div>
              <span className="font-medium">{project.name}</span>
              {project.username && (
                <>
                  <span className="mx-1">by</span>
                  <a 
                    href={`https://github.com/${project.username}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {project.username}
                  </a>
                </>
              )}
              <span className="block text-xs text-muted-foreground">{projectDate.toLocaleString()}</span>
              
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={`${tag}-${tagIndex}`} 
                      className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}