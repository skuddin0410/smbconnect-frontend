# SMB Connect

The new [smbconnect.ca](https://www.smbconnect.ca): a directory of Canadian small and medium-sized
businesses run by CanadianSME Small Business Magazine. It replaces the ListingPro WordPress site.

- **Next.js 16** (App Router) with Tailwind CSS 4
- **Supabase** project "SMB Connect" (`pmaxnkvdwwvpnsqsyzqi`, ca-central-1) holds listings, industries,
  provinces and form submissions
- Hosted on **AWS Amplify** (see `amplify.yml`)

## Pages

| Path | What it is |
| --- | --- |
| `/` | Sentence search, browse by industry and province, recently listed |
| `/businesses/` | Search with industry and province filters |
| `/industry/<slug>/`, `/province/<code>/` | Indexable browse pages |
| `/listing/<slug>/` | Business page (same URLs as the old WordPress site) |
| `/submit-listing/` | New listing and claim requests (saved to `submissions`) |
| `/about-us/`, `/contact/` | Same URLs as the old site |

Old WordPress category, location and tag URLs redirect to filtered searches (`next.config.ts`).

## Data

All 2,605 published listings, 157 categories, 62 locations and 1,922 tags were imported from the
WordPress database on 18 Nov 2026. ListingPro contact details (phone, email, website, address,
socials, hours, logo, gallery) are mapped into columns on `listings`.

Most WordPress listings had no category or location, so every listing also has:

- `sector`: one of 17 industries, filled from keywords in the name and description
- `province`: from the address or location, otherwise the phone area code

Rows filled this way have `auto_classified = true` so they can be reviewed. Form submissions land in
`submissions` with `status = 'new'`; the public key can insert them but not read them.

## Running it

```bash
npm install
cp .env.example .env.local
npm run dev            # uses the live Supabase data
npm run dev:fixture    # offline preview with the sample in dev/fixture.json
```

Environment variables (set the same ones in Amplify):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key; safe to expose, Row Level Security limits it)
- `NEXT_PUBLIC_SITE_URL` (`https://www.smbconnect.ca`)

## Still to do

- Copy logos and gallery images from the WordPress uploads folder to Supabase Storage (they are still
  loaded from `smbconnect.ca/wp-content/uploads`, so keep that folder online until then)
- An admin view for reviewing submissions and auto-classified listings
- Business-owner accounts (phase 2)
