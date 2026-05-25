import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "@/lib/tanstack.query";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ABU Law Clinic",
  description:
    "The Ahmadu Bello University Law Clinic — pro bono legal services, public interest research, and student practice.",
  keywords: "law clinic, ABU, Ahmadu Bello University, legal aid, pro bono, Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen w-full relative bg-background text-foreground">
        <TanstackQueryProvider>
          <NextTopLoader
            color="var(--primary)"
            showSpinner={false}
            height={3}
            shadow="0 0 10px rgba(0, 0, 0, 0.5)"
          />
          <Toaster richColors />
          {children}
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
