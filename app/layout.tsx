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
    <html lang='en'>
      <body className={inter.className}>
        <h1 className='text-2xl absolute top-4 left-4 font-extralight'>
          BK2YN
        </h1>
        <div className='flex flex-col items-center justify-center h-screen'>
          {children}
        </div>
      </body>
    </html>
  );
}
