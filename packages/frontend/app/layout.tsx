import "./styles/global.css";
import Navbar from "./navbar";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Travel With Knowledge",
  icons: [
    { url: "/icon.png", sizes: "32x32", type: "image/png" },
    { url: "/icon.png", sizes: "64x64", type: "image/png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#6D2608" height={4} />
        <Navbar />
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
              <div className="w-16 h-16 relative mb-6">
                <Image
                  src="/icon.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-center space-x-3 text-gray-700 text-base sm:text-lg">
                <span className="inline-block animate-spin text-3xl">🌀</span>
                <span>Loading...</span>
              </div>
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
