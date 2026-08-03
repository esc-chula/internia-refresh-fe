import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Internia",
  description: "Internship reviews by Intania students",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} bg-[#fafaf9] font-sans antialiased text-[#111111]`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
