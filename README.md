# Jaden Website - Piano Learning Platform

A Next.js application with Supabase backend for managing and viewing piano learning content.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - Get your project URL and API keys

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials and owner email.

4. **Run the development servers:**
   ```bash
   # Terminal 1: Next.js frontend
   npm run dev

   # Terminal 2: Express backend
   npm run dev:server
   ```

   Or run both concurrently:
   ```bash
   npm run dev:all
   ```

## Features

- **Public Access:** Users can view all content (videos, sheet music, technique drills, beginner plans)
- **Owner Access:** Owner can upload and manage all content through the admin dashboard
- **Authentication:** Supabase Auth for user management
- **Role-Based Access:** Owner role for content management

## Project Structure

- `/app` - Next.js pages and routes
- `/components` - React components
- `/server` - Express API server
- `/lib` - Utilities and API clients
- `/supabase` - Database schema

## Admin Access

The owner email (set in `.env.local`) will automatically get owner role on signup. Access the admin dashboard at `/admin` when logged in as owner.
