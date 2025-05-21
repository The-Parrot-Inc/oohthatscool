import { describe, it, expect } from 'vitest';
import { GET } from '../../src/pages/api/health';

describe('Health endpoint', () => {
  it('should return a 200 status and correct structure', async () => {
    // Test the GET handler directly
    const response = await GET();
    
    // Check status
    expect(response.status).toBe(200);
    
    // Convert Response object to plain object for testing
    const responseBody = await response.json();
    
    // Check structure
    expect(responseBody).toHaveProperty('status');
    expect(responseBody).toHaveProperty('message');
    expect(responseBody).toHaveProperty('timestamp');
    
    // Check values
    expect(responseBody.status).toBe('ok');
    expect(responseBody.message).toBe('API is healthy');
    expect(typeof responseBody.timestamp).toBe('string');
    
    // Validate timestamp format (ISO 8601)
    const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(timestampRegex.test(responseBody.timestamp)).toBe(true);
  });
});