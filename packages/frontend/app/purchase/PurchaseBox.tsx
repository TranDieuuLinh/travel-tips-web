"use client";
import React, { useEffect, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Country } from "@/sanity/ImportSanCountry";
import { urlFor } from "@/sanity/urlFor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { config } from "dotenv";
import { PiSignInFill } from "react-icons/pi";
import { PiShoppingCartDuotone } from "react-icons/pi";
config({ quiet: true });
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePaidCountries } from "@/hooks/usePaidCountries";
import { useCart } from "@/hooks/useCart";

type Props = {
  countries: Country[];
};

const PurchaseBox = ({ countries }: Props) => {
  const [countriesDrpDwnList, setCountriesDrpDwnList] = useState<string[]>([]);
  const [dropDown, setDropDown] = useState(false);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
  const {data:authUser} = useAuth();
  const userId = authUser?.id?? 0;
  const email = authUser?.email?? "";
  const {data: paidcountries = []} = usePaidCountries();
  const router = useRouter();
  const useparams = useSearchParams();
  const countryslug = useparams.get("countryslug");
  const [autoAddSlug, setAutoAddSlug] = useState<string | null>(countryslug);
  const { cartItems, cartLoading, addToCart, deleteFromCart } = useCart();


  const clickOutside = (e: MouseEvent) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(e.target as Node)
    ) {
      setDropDown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", clickOutside);
    return () => window.removeEventListener("click", clickOutside);
  }, []);

  useEffect(() => {
    if (!countries.length) return;
    const filtered = countries
      .filter(
        (p) =>
          !cartItems.includes(p.slug) &&
          !paidcountries.includes(p.slug)
      )
      .map((e) => e.slug);
    setCountriesDrpDwnList(filtered);
  }, [countries, cartItems, paidcountries]);

  const checkLogin = () => {
    return router.push("/signin");
  };

  useEffect(() => {
    const fetchCountryMainPsot = async () => {};
    fetchCountryMainPsot();
  }, []);

  const handleSelect = async (countrySlug: string) => {
    if (userId === 0) return router.push("/signin");
    try {
      await addToCart(countrySlug);
      setCountriesDrpDwnList((prev) => prev.filter((p) => p !== countrySlug));
      setDropDown(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const importBuySlug = async () => {
      if (!autoAddSlug || userId === 0 || cartLoading) return;
      const slug = autoAddSlug.trim().toLowerCase();
      if (cartItems.includes(slug)) return;
      setAutoAddSlug(null);
      await handleSelect(slug);
    };
    importBuySlug();
  }, [autoAddSlug, userId, cartLoading, cartItems]);

  const handleDelete = async (countrySlug: string) => {
    try {
      await deleteFromCart(countrySlug);
      setCountriesDrpDwnList((prev) =>
        prev.includes(countrySlug) ? prev : [...prev, countrySlug]
      );
    } catch (error) {
      console.error(error);
    }
  };

  const nameBySlug = React.useMemo(() => {
    return new Map(countries.map((c) => [c.slug, c.countryName]));
  }, [countries]);

  const filtered = countries.filter((p) => cartItems.includes(p.slug));

  const processCheckout = () => {
    const params = new URLSearchParams({
      country_slug: cartItems.join(","),
      user_id: userId.toString(),
      quantity: cartItems.length.toString(),
      email: email,
    });

    router.push(`/purchase/payment?${params.toString()}`);
  };

  return (
    <div className="flex flex-col justify-center items-center pb-10 pt-24 px-3 sm:px-5 md:px-10 min-h-screen">
      <h1 className="font-semibold text-center text-[18px] md:text-2xl font-serif flex py-1 sm:py-4">
        💫 Choose Countries To Explore
      </h1>

      {/* Dropdown */}
      <div className="relative w-50 md:w-60 lg:w-65 rounded-2xl space-y-2">
        <p className="text-center text-xs sm:text-sm">$2 AUD each country</p>
        <div
          ref={dropdownMenuRef}
          className="border rounded-2xl font-extralight text-sm px-3 py-1 flex justify-between items-center cursor-pointer"
          onClick={() =>
            countriesDrpDwnList.length > 0 && setDropDown(!dropDown)
          }
        >
          <span>
            {countriesDrpDwnList.length > 0 ? (
              <span className="flex">Choose countries... </span>
            ) : (
              "No more countries 😵"
            )}
          </span>
          {countriesDrpDwnList.length > 0 && <span className="ml-2">▼</span>}
        </div>

        <div className="bg-gray-100 absolute z-30 w-full rounded">
          {dropDown &&
            countriesDrpDwnList.map((p, index) => (
              <p
                key={index}
                onClick={() => handleSelect(p)}
                className="px-3 py-2 hover:bg-red-100 cursor-pointer text-sm "
              >
                {nameBySlug.get(p) ?? p}
              </p>
            ))}
        </div>
      </div>

      {/* Cart Box */}
      <div className="flex justify-center w-full mt-8 md:px-6">
        <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 shadow sm:shadow-xl bg-white rounded-2xl space-y-3">
          {cartItems.length === 0 && email && (
            <div className="justify-center w-full flex flex-col items-center text-base sm:text-base font-extralight space-y-2 py-6">
              <PiShoppingCartDuotone className="text-[#6D2608]" size={40} />
              <span>Your Cart Is Empty </span>
            </div>
          )}
          {!email && (
            <div className="justify-center w-full flex flex-col items-center text-base sm:text-base font-extralight space-y-2 py-6">
              <PiSignInFill className="text-[#6D2608]" size={40} />
              <span>Sign in to Purchase </span>
            </div>
          )}
          {filtered.map((e) => (
            <div
              key={e.slug}
              className="flex sm:flex-row justify-between items-start gap-2 sm:gap-3 py-1 sm:py-2"
            >
              <div className="shrink-0 w-24 md:w-28 lg:w-32 h-20 md:h-28 relative">
                <Image
                  src={urlFor(e.imageCover).quality(50).url()}
                  alt={e.countryName}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="text-right flex-1 space-y-1 md:text-base text-xs">
                <button>
                  <RiDeleteBin5Fill
                    onClick={() => handleDelete(e.slug)}
                    className="text-red-600"
                  />
                </button>
                <p className="font-bold">{e.countryName}</p>
                <span className="font-extralight"> $AUD 2</span>
              </div>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between font-extralight text-xs sm:text-sm px-2">
            Subtotal: <span>$AUD {2 * cartItems.length}</span>
          </div>

          <div className="flex justify-center mt-3">
            {email ? (
              <button
                className="bg-[#6D2608] px-10 sm:px-16 py-2 text-sm sm:text-base text-white rounded-lg"
                disabled={cartItems.length <= 0}
                onClick={processCheckout}
              >
                Next
              </button>
            ) : (
              <button
                className="bg-[#6D2608] px-10 sm:px-16 py-2 text-sm sm:text-base text-white rounded-lg cursor-pointer"
                onClick={checkLogin}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBox;
