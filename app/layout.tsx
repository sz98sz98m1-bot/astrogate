import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarfieldBackground from "@/components/effects/StarfieldBackground";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "بوابة الفلك | AstroGate";
const SITE_DESCRIPTION =
  "بوابة الفلك: احسب خريطتك الفلكية، اكتشف توافق الأبراج، وتابع الأبراج اليومية والأسبوعية بتحليل مدعوم بالذكاء الاصطناعي.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ["أبراج", "فلك", "تنجيم", "خريطة فلكية", "توافق الأبراج", "astrology", "natal chart"],
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#040612",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <StarfieldBackground />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
