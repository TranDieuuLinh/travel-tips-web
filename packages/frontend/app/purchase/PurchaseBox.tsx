"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Country } from "@/sanity/ImportSanCountry";
import { urlFor } from "@/sanity/urlFor";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { PiSignInFill, PiShoppingCartDuotone } from "react-icons/pi";

import { useAuth } from "@/hooks/useAuth";
import { usePaidCountries } from "@/hooks/usePaidCountries";
import { useCart } from "@/hooks/useCart";

type Props = {
  countries: Country[];
};

const PurchaseBox = ({ countries }: Props) => {
  const [dropDown, setDropDown] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const { data: authUser, isLoading: authLoading } = useAuth();
  const userId = authUser?.id ?? 0;
  const email = authUser?.email ?? "";

  const { data: paidcountries = [] } = usePaidCountries();
  const { cartItems, cartLoading, addToCart, deleteFromCart } = useCart();

  const router = useRouter();
  const params = useSearchParams();

  const autoAddSlug = params.get("countryslug");


  useEffect(() => {
    setMounted(true);
    const clickOutside = (e: MouseEvent) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(e.target as Node)
      ) {
        setDropDown(false);
      }
    };

    window.addEventListener("click", clickOutside);
    return () => window.removeEventListener("click", clickOutside);
  }, []);

  const countriesDrpDwnList = useMemo(() => {
    if (!countries.length) return [];

    return countries
      .filter(
        (p) =>
          !cartItems.includes(p.slug) &&
          !paidcountries.includes(p.slug)
      )
      .map((c) => c.slug);
  }, [countries, cartItems, paidcountries]);

  const filtered = useMemo(() => {
    return countries.filter((p) => cartItems.includes(p.slug));
  }, [countries, cartItems]);

  const nameBySlug = useMemo(() => {
    return new Map(countries.map((c) => [c.slug, c.countryName]));
  }, [countries]);

  const handleSelect = async (slug: string) => {
    if (userId === 0) return router.push("/signin");

    try {
      await addToCart(slug);
      setDropDown(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!autoAddSlug || userId === 0 || cartLoading) return;

      const slug = autoAddSlug.trim().toLowerCase();

      if (cartItems.includes(slug)) return;

      await handleSelect(slug);
    };

    run();
  }, [autoAddSlug, userId, cartLoading, cartItems]);

  const handleDelete = async (slug: string) => {
    try {
      await deleteFromCart(slug);
    } catch (err) {
      console.error(err);
    }
  };

  const processCheckout = () => {
    const params = new URLSearchParams({
      country_slug: cartItems.join(","),
      quantity: cartItems.length.toString(),
      email,
    });

    router.push(`/purchase/payment?${params.toString()}`);
  };

  return (
    <div className="flex flex-col justify-center items-center pb-10 pt-24 px-3 min-h-screen">

      <h1 className="font-semibold text-center text-[18px] md:text-2xl font-serif">
        💫 Choose Countries To Explore
      </h1>

      <div className="relative w-60 space-y-2 mt-4">
        <p className="text-center text-xs">$2 AUD each country</p>

        <div ref={dropdownMenuRef} className="border rounded-2xl font-extralight text-sm px-3 py-1 flex justify-between items-center cursor-pointer" 
          onClick={() => countriesDrpDwnList.length > 0 && setDropDown(!dropDown) } > 
        <span> {countriesDrpDwnList.length > 0 ? 
        ( <span className="flex">Choose countries... </span> ) : ( "No more countries 😵" )}
         </span> {countriesDrpDwnList.length > 0 && <span className="ml-2">▼</span>} 
         </div>

        {dropDown && (
          <div className="absolute z-30 w-full bg-gray-100 rounded">
            {countriesDrpDwnList.map((p) => (
              <p
                key={p}
                onClick={() => handleSelect(p)}
                className="px-3 py-2 hover:bg-red-100 cursor-pointer"
              >
                {nameBySlug.get(p) ?? p}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-8 bg-white rounded-2xl p-6 shadow">
        {(!mounted || authLoading) && (
          <div className="text-center flex flex-col items-center">
            <span className="animate-spin">🌀</span>
            <span>Loading...</span>
          </div>
        )}

        {mounted && !authLoading && cartItems.length === 0 && email && (
          <div className="text-center flex flex-col items-center">
            {mounted && <PiShoppingCartDuotone size={40} />}
            <span>Your Cart Is Empty</span>
          </div>
        )}

        {mounted && !authLoading && !email && (
          <div className="text-center flex flex-col items-center">
            {mounted && <PiSignInFill size={40} />}
            <span>Sign in to Purchase</span>
          </div>
        )}

        {filtered.map((e) => (
          <div key={e.slug} className="flex justify-between py-2">

            <div className="w-24 h-20 relative">
              <Image
                src={urlFor(e.imageCover).quality(50).url()}
                alt={e.countryName}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="text-right">
              <button onClick={() => handleDelete(e.slug)}>
                <RiDeleteBin5Fill className="text-red-600" />
              </button>
              <p className="font-bold">{e.countryName}</p>
              <span>$AUD 2</span>
            </div>

          </div>
        ))}

        <hr className="my-3" />

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>$AUD {2 * cartItems.length}</span>
        </div>

        <div className="flex justify-center mt-4">
          {!mounted || authLoading ? (
            <button
              className="bg-[#6D2608] text-white px-10 py-2 rounded"
              disabled
            >
              Loading...
            </button>
          ) : email ? (
            <button
              className="bg-[#6D2608] text-white px-10 py-2 rounded"
              disabled={cartItems.length === 0}
              onClick={processCheckout}
            >
              Next
            </button>
          ) : (
            <button
              className="bg-[#6D2608] text-white px-10 py-2 rounded"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PurchaseBox;