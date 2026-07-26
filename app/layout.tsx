import type { Metadata } from "next";
import { GlobalFooter, GlobalShell } from "@/components/global-shell";
import { ReadingProgressBar } from "@/components/reading-progress";
import { RouteStyling } from "@/components/route-styling";
import "./globals.css";
import "./global-shell.css";
import "./james-theme.css";
import "./background-content.css";
import "./james-reader.css";

export const metadata: Metadata = {
  title: {
    default: "James Commentary",
    template: "%s | James Commentary"
  },
  description: "A five-chapter study of James with the King James text and verse-by-verse commentary.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://james.mybibleexplorer.com"),
  openGraph: {
    title: "James Commentary",
    description: "Wisdom for a faith that works: the complete KJV text with verse-by-verse study notes.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "James Commentary" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "James Commentary",
    description: "Wisdom for a faith that works: the complete KJV text with verse-by-verse study notes.",
    images: ["/og.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@400;500;600&display=swap"
        />
      </head>
      <body className="mbe-shell-managed" data-james-route="home">
        <RouteStyling />
        <GlobalShell />
        <ReadingProgressBar />
        {children}
        <GlobalFooter />
      </body>
    </html>
  );
}
