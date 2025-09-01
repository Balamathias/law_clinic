import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Lexend } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "@/lib/tanstack.query";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Law Clinic ~ Ahmadu Bello University",
  description: "A Law Clinic for the students of Ahmadu Bello University",
  keywords: "law, clinic, university, students, Ahmadu Bello University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackQueryProvider>
      <html lang="en">
          <body
            className={`${lexend.className} antialiased min-h-screen w-full relative`}
          >
            <NextTopLoader 
              color="var(--primary)"
              showSpinner={false}
              height={3}
              shadow="0 0 10px rgba(0, 0, 0, 0.5)"
            />
            <Toaster richColors />
            {children}
          </body>
      </html>
    </TanstackQueryProvider>
  );
}
