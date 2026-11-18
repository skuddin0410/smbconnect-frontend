export type Sector = { slug: string; name: string; blurb: string | null; sort: number; listing_count: number };
export type Province = { code: string; name: string; sort: number; listing_count: number };

export type ListingSummary = {
  id: number;
  slug: string;
  title: string;
  tagline: string | null;
  excerpt: string | null;
  city: string | null;
  province: string | null;
  sector: string | null;
  logo_url: string | null;
  image_url: string | null;
  website: string | null;
  phone: string | null;
  claimed: boolean;
};

export type Hours = Record<string, { open?: string; close?: string } | string>;

export type Listing = ListingSummary & {
  description_html: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  email: string | null;
  socials: Record<string, string>;
  gallery: string[];
  business_hours: Hours | null;
  tags: string[];
  rating: number | null;
  review_count: number;
  published_at: string | null;
  updated_at: string;
};
