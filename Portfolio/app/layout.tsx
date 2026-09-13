import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/providers";
import { SITE, SITE_ORIGIN } from "@/lib/constants";
import "./globals.css";

/**
 * The design sets body and UI copy in Inter (nodes 1:30, 1:37-1:43) and
 * display copy in SF Pro Bold (1:22, 1:26, 1:35). SF Pro is Apple
 * proprietary and cannot be self-hosted, so `--font-display` in
 * globals.css resolves to the system SF on Apple platforms and falls
 * back to Inter, which is metrically compatible.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_ORIGIN,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1024, height: 1024, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main" className="sr-only">
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
