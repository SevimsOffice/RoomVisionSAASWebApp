# RoomVision - AI-Powered Room Design SaaS

Transform your spaces with AI-powered room design. Upload your room or furniture images and generate stunning video transformations.

## Features

🖼 **Core Function**
- Upload room or furniture images
- Choose between "Room to Furniture" or "Furniture to Room" modes
- Select room types (Living Room, Bedroom, Office, etc.)
- Apply various styles (Classic, Modern, Futuristic, etc.)
- Generate videos using Higgsfield AI API

💳 **Monetization**
- Credit-based system (1 free credit for new users)
- Credit packages: 10 credits ($9), 30 credits ($19), 100 credits ($29)
- Stripe Checkout integration
- Customer billing portal
- Automatic credit allocation via webhooks

👤 **Authentication**
- NextAuth.js integration
- Google OAuth
- Email/password authentication
- Automatic free credit allocation for new users

💾 **Database**
- PostgreSQL with Prisma ORM
- User profiles and credit management
- Video storage with metadata
- Transaction history

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

**Required API Keys:**

1. **Database** - PostgreSQL connection string
2. **NextAuth** - Secret for JWT signing
3. **Google OAuth** - Client ID and secret from Google Cloud Console
4. **Stripe** - API keys from Stripe Dashboard
5. **Higgsfield** - API key from Higgsfield platform

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 3. Stripe Configuration

1. Create products and prices in Stripe Dashboard:
   - Small Pack: 10 credits for $9.00
   - Medium Pack: 30 credits for $19.00  
   - Large Pack: 100 credits for $29.00

2. Update the price IDs in `lib/stripe.ts`

3. Set up webhook endpoint: `https://yourdomain.com/api/stripe-webhook`
   - Listen for `checkout.session.completed` events

### 4. Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add callback URL: `https://yourdomain.com/api/auth/callback/google`

### 5. Higgsfield API

1. Sign up at Higgsfield platform
2. Get your API key
3. Add it to environment variables

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

The app is configured for static export and will work on Vercel out of the box.

### Database Migration

If using a hosted database (like PlanetScale, Neon, or Supabase):

```bash
npx prisma migrate deploy
```

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth configuration
│   │   ├── generate-video/ # Video generation endpoint
│   │   ├── list-effects/  # Effects fetching
│   │   └── stripe-*       # Stripe integration
│   ├── dashboard/         # User dashboard
│   └── page.tsx          # Main application
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ImageUpload.tsx   # Image upload component
│   ├── EffectGrid.tsx    # Effects selection
│   └── VideoGallery.tsx  # Generated videos display
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── stripe.ts         # Stripe configuration
│   ├── auth.ts           # NextAuth configuration
│   └── higgsfield.ts     # AI API client
├── prisma/               # Database schema
└── .env.example          # Environment variables template
```

## Key Features Implementation

### Credit System
- Users start with 1 free credit
- Each generation costs 1 credit
- Credits purchased via Stripe are added automatically
- Generation blocked when credits = 0

### Video Generation Flow
1. User uploads image and selects parameters
2. System checks user credits
3. Calls Higgsfield API for generation
4. Saves video metadata to database
5. Deducts 1 credit from user account

### Payment Processing
1. User selects credit package
2. Stripe Checkout session created
3. User completes payment
4. Webhook receives confirmation
5. Credits added to user account automatically

## Support

For issues or questions:
- Check the environment variables are correctly set
- Ensure all API keys are valid and have proper permissions
- Verify webhook endpoints are accessible
- Check database connection and migrations

## License

MIT License - see LICENSE file for details.