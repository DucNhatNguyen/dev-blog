import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { siteMetadata, siteUrl } from "./site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteMetadata.name,
  alternates: { canonical: "/" },
  authors: [{ name: "Nguyễn Đức Nhật" }],
  creator: "Nguyễn Đức Nhật",
  publisher: siteMetadata.name,
  keywords: ["lập trình", "kỹ thuật phần mềm", "hệ thống phân tán", "cơ sở dữ liệu", "software engineering"],
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteMetadata.locale,
    url: "/",
    siteName: siteMetadata.name,
    title: "dev.notes — Lập trình chuyên sâu",
    description: siteMetadata.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "dev.notes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "dev.notes — Lập trình chuyên sâu",
    description: siteMetadata.description,
    images: ["/opengraph-image"],
  },
  title: "dev.notes — Lập trình chuyên sâu",
  description:
    "Ghi chép chuyên sâu về lập trình, hệ thống phân tán, cơ sở dữ liệu và kỹ thuật phần mềm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-preference" strategy="beforeInteractive">
          {`try {
            const savedTheme = localStorage.getItem("dev-notes-theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
              document.documentElement.classList.add("dark");
            }
          } catch {}`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: siteMetadata.name,
              description: siteMetadata.description,
              url: siteUrl,
              inLanguage: "vi-VN",
              author: { "@type": "Person", name: "Nguyễn Đức Nhật" },
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
