import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai, Noto_Sans_Thai_Looped } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansThaiLooped = Noto_Sans_Thai_Looped({
  subsets: ["thai"],
  variable: "--font-noto-thai-looped",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Internia",
  description: "Internship reviews by Intania students",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className={`${inter.variable} ${notoSansThai.variable} ${notoSansThaiLooped.variable} bg-white font-sans antialiased text-zinc-900`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
