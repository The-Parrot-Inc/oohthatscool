# Days Without ...

A simple application to track days without ... , built with Astro. Features a beach-themed UI and modern card design.

## Local Development

### Prerequisites

- Node.js >= 20.x
- npm 

### Setup

1. Install dependencies:
```bash
npm install
```

The project uses the following main dependencies:
- Astro: Static site builder
- TailwindCSS: For styling components
- React: For interactive components

2Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:4321
```

## Supabase Integration

This project uses Supabase for data storage. Follow these steps to set up your own Supabase instance:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Create a table called `rust_projects` with the following columns:
   - `id` (uuid, primary key)
   - `name` (text, not null)
   - `url` (text, not null)
   - `description` (text, not null)
   - `username` (text, not null)
   - `tags` (array, not null)
   - `submitted_at` (timestamp with timezone, not null)
   - `active` (boolean, not null, default true)

4. Copy your Supabase URL and anon/public key from the Supabase dashboard:
   - Project Settings > API > URL and anon/public key

5. Create a `.env` file in your project root:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. For deployment, add these same environment variables to your Vercel project settings.

## Deployment on Vercel

This project is configured for easy deployment on Vercel.

### Steps for Deployment

1. Fork or clone this repository to your GitHub account.

2. Connect to Vercel:
   - Create a Vercel account if you don't have one
   - Import your repository from GitHub
   - Vercel will automatically detect the Astro framework

3. Deploy:
   - Click "Deploy" and Vercel will build and deploy your application
   - Vercel will provide you with a unique URL to access your deployed application

### Configuration

The project includes a `vercel.json` file that configures the build process for Vercel deployment. No additional configuration is needed for a basic deployment.

### Running Tests Locally

To run the tests locally:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```
