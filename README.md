# PC Builder

Gaming PC & components e-commerce store built with Next.js 16, Tailwind CSS 4 and Supabase.

- Storefront: Home, Shop (categories, search, sort), product pages, cart, cash-on-delivery checkout, About, Contact
- Admin panel at `/admin`: dashboard, products, categories, orders, messages, store settings

## Environment variables

Create `.env.local` (and add the same variables in your hosting provider):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Both values are in the Supabase dashboard under **Project Settings → API**.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The first account created at `/admin/login` becomes the store admin.

## Deploy (Vercel)

1. Import this GitHub repository at https://vercel.com/new.
2. Add the two environment variables above.
3. Deploy.
4. In Supabase → **Authentication → URL Configuration**, set **Site URL** to your live domain and add
   `https://<your-domain>/auth/callback` to **Redirect URLs** (needed for email confirmation links).

## Product photos

Product images live in `public/products`. To import a new batch of photos, list them in
`scripts/catalog.cjs` and run:

```bash
node scripts/import-photos.cjs "E:/photos"
```

This removes the studio background from each photo, writes `public/products/*.webp`, and generates
`scripts/import-photos.sql` to load the products into Supabase.
