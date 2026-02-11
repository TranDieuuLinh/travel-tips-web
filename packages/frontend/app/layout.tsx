import "./styles/global.css";
import Navbar from "./navbar";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Travel With Knowledge",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "64x64", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Suspense>
        {children}
        </Suspense>
    
      </body>
    </html>
  );
}
