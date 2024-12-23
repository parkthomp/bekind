import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Be Kind",
  description: "Be Kind to Your Neighbor App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <h1 className="text-5xl absolute top-8 left-8 font-extralight">
          BK2YN
        </h1>
        {children}
      </body>
    </html>
  );
}
