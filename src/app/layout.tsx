import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/supabase";

// Archivo variable font (weight 100–900, width 62–125%), bundled so pages never wait on Google Fonts.
const archivo = localFont({
  variable: "--font-archivo",
  src: [{ path: "./fonts/archivo-latin-wdth-normal.woff2", weight: "100 900", style: "normal" }],
  display: "swap",
  fallback: ["system-ui", "Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SMB Connect – Find Canadian small businesses",
    template: "%s | SMB Connect",
  },
  description:
    "Find trusted Canadian small and medium-sized businesses by industry and province. A free directory by CanadianSME Small Business Magazine.",
  openGraph: { siteName: "SMB Connect", type: "website", locale: "en_CA" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${archivo.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
