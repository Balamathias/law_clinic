import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "@/lib/tanstack.query";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

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
            className={`${inter.className} antialiased min-h-screen w-full relative`}
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
