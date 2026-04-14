# Home Haven - Project Setup Guide

## Overview
Home Haven is a Next.js real estate management platform built with Supabase and TailwindCSS.

## Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available at https://supabase.com)
- Git

## Installation Steps

### 1. Clone & Install Dependencies
```bash
cd home-haven
npm install
```

### 2. Set Up Supabase Project
1. Create a new Supabase project at https://supabase.com
2. Use the free tier
3. Copy your project URL and Anon Key

### 3. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Initialize Database Schema
1. Go to Supabase SQL Editor
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire SQL and paste into Supabase SQL Editor
4. Click "Run"

This will create:
- profiles
- properties
- contacts
- deals
- payments
- messages
- tasks
- appointments
- invoices
- documents
- maintenance_requests
- notifications
- contracts

### 5. Create Sample Data (Optional)
You can import the seed data using Supabase UI or using the SQL in `supabase/migrations/002_seed_data.sql`

### 6. Set Up Authentication
1. In Supabase, go to Authentication → Providers
2. Enable Email provider (default)
3. (Optional) Enable Google OAuth:
   - Get Google OAuth credentials from Google Cloud Console
   - Add to Supabase
   - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`

### 7. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 with your browser.

## Default Admin User
Create an admin user by signing up with your email. Then manually set their role to 'super_admin' in the profiles table.

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   ├── explore/        # Public property browsing
│   └── property/       # Property detail pages
├── components/         # Reusable React components
└── lib/               # Utilities and Supabase client
```

## Key Features
- **Properties**: Manage listings with filters, images, and details
- **Contacts**: Track leads with scoring and status
- **Deals**: Pipeline management and deal tracking
- **Team**: Manage agents and permissions
- **Messages**: Communication hub
- **Payments**: Track commissions and payments
- **Documents**: File management
- **Tasks**: Team task management
- **Appointments**: Calendar and scheduling
- **Reports**: Analytics and dashboards

## Building for Production
```bash
npm run build
npm run start
```

## Deployment
### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms
This is a standard Next.js app. Deploy to any Node.js hosting:
- Hercel
- Railway
- Render
- AWS EC2
- DigitalOcean
- etc.

## Troubleshooting

### Database Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key in `.env.local`
- Ensure Supabase project is active
- Check RLS policies in Supabase (should be permissive for dev)

### Authentication Issues
- Clear browser cache and cookies
- Check Supabase Auth settings
- Verify callback URLs if using OAuth

### Missing Data
- Ensure tables are created (run the SQL schema)
- Check RLS policies aren't blocking access
- Verify user has correct role

## Support
For issues with:
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/learn
- **TailwindCSS**: https://tailwindcss.com/docs
