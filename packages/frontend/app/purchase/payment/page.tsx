"use client";
import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";


const Page = () => {
  const searchQuery = useSearchParams();
  const quantity = searchQuery.get("quantity");
  const email = searchQuery.get("email");
  const country_slug = useMemo(
    () => searchQuery.get("country_slug")?.split(",") || [],
    [searchQuery]
  );

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        if (!country_slug || !quantity) return;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/create-checkout-session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              country_slug: country_slug,
              quantity: Number.parseInt(quantity),
              email: email,
            }),
          }
        );
        const data = await response.json();
        if (!data.sessionurl) return;
        window.location.href = data.sessionurl;
      } catch (error) {
        console.error(error);
      }
    };
    fetchCheckout();
  }, [country_slug, email, quantity]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 relative mb-6">
        <Image
          src="/icon.png"
          alt="Logo"
          fill
          sizes="64px"
          className="object-contain"
        />
      </div>

      <div className="flex items-center space-x-3 text-gray-700 text-base sm:text-lg">
        <span className="inline-block animate-spin text-3xl">🌀</span>
        <span>Redirecting...</span>
      </div>
    </div>
  );
};

export default Page;
