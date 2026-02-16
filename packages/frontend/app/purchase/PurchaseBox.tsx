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

type Props = {
  countries: Country[];
};

interface DataFetcher<T> {
  data: T;
  loaded: boolean;
}

const PurchaseBox = ({ countries }: Props) => {
  const [inBasketData, setInBasketData] = useState<DataFetcher<string[]>>({
    data: [],
    loaded: false,
  });
  const [countriesDrpDwnList, setCountriesDrpDwnList] = useState<string[]>([]);
  const [dropDown, setDropDown] = useState(false);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
  const [userId, setuserId] = useState(0);
  const [email, setemail] = useState("");
  const router = useRouter();
  const [paidcountries, setpaidcountries] = useState<string[]>([]);
  const useparams = useSearchParams();
  const countryslug = useparams.get("countryslug");
  const [autoAddSlug, setAutoAddSlug] = useState<string | null>(countryslug);

  const uid = useparams.get("uid");

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
    const checklogin = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/login/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) return;
        const result = await response.json();
        if (!result.id || !result.email) return;
        setuserId(result.id);
        setemail(result.email);

        const paidcountryRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/paidcountries/paidcountryname?userid=${encodeURIComponent(result.id)}`
        );
        if (!paidcountryRes.ok) return;
        const paidcountrydata = await paidcountryRes.json();
        setpaidcountries(paidcountrydata.paidcountries);

        const cartRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/basket/cart?userid=${encodeURIComponent(result.id)}`
        );

        const cartData: { cart?: { cart_country_name: string }[] } =
          await cartRes.json();

        const cart = cartData.cart || [];
        setInBasketData({
          data: cart.map((c) => c.cart_country_name),
          loaded: true,
        });
      } catch (error) {
        console.error(error);
      }
    };
    checklogin();
  }, []);

  useEffect(() => {
    if (!countries.length) return;
    const filtered = countries
      .filter(
        (p) =>
          !inBasketData.data.includes(p.countryName) &&
          !paidcountries.includes(p.countryName.toLowerCase())
      )
      .map((e) => e.countryName);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountriesDrpDwnList(filtered);
  }, [countries, inBasketData, paidcountries]);

  const checkLogin = () => {
    return router.push("/signin");
  };

  useEffect(() => {
    const fetchCountryMainPsot = async () => {};
    fetchCountryMainPsot();
  }, []);

  const handleSelect = async (country: string) => {
    if (userId === 0) return router.push("/signin");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/basket/cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            cart_slug: country.trim().toLowerCase(),
            cart_country_name: country,
          }),
        }
      );
      if (!response.ok) return alert("Failed to add cart");

      setInBasketData((prev) => ({ ...prev, data: [...prev.data, country] }));
      setCountriesDrpDwnList((prev) => prev.filter((p) => p !== country));
      setDropDown(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const importBuyName = async () => {
      if (!autoAddSlug || userId === 0 || !inBasketData.loaded) return;

      const capitalize = autoAddSlug.replace(
        /\b\w+/g,
        (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()
      );

      // prevent double insert
      console.log(capitalize, inBasketData);
      if (inBasketData.data.includes(capitalize)) return;
      setAutoAddSlug("");
      await handleSelect(capitalize);
    };
    importBuyName();
  }, [autoAddSlug, userId, inBasketData]);

  const handleDelete = async (country: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/basket/cart`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            cart_slug: country.trim().toLowerCase(),
          }),
        }
      );
      if (!response.ok) return alert("Failed to delete cart");

      setInBasketData((prev) => ({
        ...prev,
        data: prev.data.filter((p) => p !== country),
      }));
      setCountriesDrpDwnList((prev) => [...prev, country]);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = countries.filter((p) =>
    inBasketData.data.includes(p.countryName)
  );

  const processCheckout = () => {
    const params = new URLSearchParams({
      country_slug: inBasketData.data.map((p) => p.toLowerCase()).join(","),
      user_id: userId.toString(),
      quantity: inBasketData.data.length.toString(),
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
                {p}
              </p>
            ))}
        </div>
      </div>

      {/* Cart Box */}
      <div className="flex justify-center w-full mt-8 md:px-6">
        <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 shadow sm:shadow-xl bg-white rounded-2xl space-y-3">
          {inBasketData.data.length === 0 && email && (
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
                    onClick={() => handleDelete(e.countryName)}
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
            Subtotal: <span>$AUD {2 * inBasketData.data.length}</span>
          </div>

          <div className="flex justify-center mt-3">
            {email ? (
              <button
                className="bg-[#6D2608] px-10 sm:px-16 py-2 text-sm sm:text-base text-white rounded-lg"
                disabled={inBasketData.data.length <= 0}
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
