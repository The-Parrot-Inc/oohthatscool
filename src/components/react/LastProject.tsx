import React, { useState, useEffect } from 'react';

type Project = {
  name: string;
  url: string;
  description: string;
  username: string;
  tags: string[];
  submitted_at: string;
};

export default function LastProject() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLastProject = async () => {
      try {
        setLoading(true);
        // Fetch projects from the API
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.projects && data.projects.length > 0) {
          // Get only the first (most recent) project
          setProject(data.projects[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading last project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchLastProject();
  }, []);
  
  if (loading) {
    return <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Loading latest project...</div>;
  }
  
  if (error) {
    return <div className="text-xs sm:text-sm text-red-500">Error loading project: {error}</div>;
  }
  
  if (!project) {
    return <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No projects submitted yet</div>;
  }

  // Format date in a more concise way
  const projectDate = new Date(project.submitted_at);
  const formattedDate = projectDate.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = projectDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-slate-800/70 rounded-lg p-3 sm:p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center">
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100">
              {project.name}
            </h3>
            <span className="inline-flex items-center bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-0.5 rounded-full ml-2 font-medium">
              Latest
            </span>
          </div>
          
          {project.url && (
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs sm:text-sm text-red-500 hover:text-red-700 hover:underline break-all inline-block"
            >
              {project.url}
            </a>
          )}
          
          {project.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {project.description}
            </p>
          )}
          
          <div className="flex flex-wrap sm:flex-nowrap sm:items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {project.username && (
                <a 
                  href={`https://github.com/${project.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  {project.username}
                </a>
              )}
            </span>
            
            <span className="hidden sm:inline mx-2">•</span>
            
            <span className="flex items-center mt-1 sm:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {formattedDate} at {formattedTime}
            </span>
          </div>
          
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1">
              {project.tags.map((tag, tagIndex) => (
                <span 
                  key={`${tag}-${tagIndex}`} 
                  className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 