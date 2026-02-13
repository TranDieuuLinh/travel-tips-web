"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { config } from "dotenv";
config({ quiet: true });
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const logoutUser = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });
        window.location.href = "/";
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    logoutUser();
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 relative mb-6">
        <Image src="/icon.png" alt="Logo" fill className="object-contain" />
      </div>

      <div className="flex items-center space-x-3 text-gray-700 text-base sm:text-lg">
        <span className="inline-block animate-spin text-3xl">🌀</span>
        <span>Logging Out...</span>
      </div>
    </div>
  );
};

export default Page;
