import type { Metadata } from "next";
import { Lato, Inter } from "next/font/google";
import "./globals.css";
import CustomLayout from "./components/CustomLayout";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: "100",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Healthcare Solutions Ltd | Bill Management",
  description: "Healthcare Solutions Ltd Company all Bills and Customers Management",
  keywords: ["Bills", "Next.js", "Healthcare", "Solutions", "Medical"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${inter.variable} antialiased`}>
        <CustomLayout>{children}</CustomLayout>
      </body>
    </html>
  );
}
