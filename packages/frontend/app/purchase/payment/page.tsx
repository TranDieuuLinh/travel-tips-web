"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchQuery = useSearchParams();
  const user_id = searchQuery.get("user_id");
  const country_slug = searchQuery.get("country_slug")?.split(",") || [];
  const quantity = searchQuery.get("quantity");
  const email = searchQuery.get("email");
  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        if (!user_id || !country_slug || !quantity) return;
        const response = await fetch(
          "http://localhost:3000/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              country_slug: country_slug,
              user_id: user_id,
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
  }, [country_slug, email, quantity, user_id]);

  return <div>Redirecting...</div>;
};

export default Page;
