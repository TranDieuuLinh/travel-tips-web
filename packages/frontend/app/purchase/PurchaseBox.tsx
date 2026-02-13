"use client";
import React, { useEffect, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Country } from "@/sanity/ImportSanCountry";
import { urlFor } from "@/sanity/urlFor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { config } from "dotenv";
config({quiet:true});

type Props = {
  countries: Country[];
};

const PurchaseBox = ({ countries }: Props) => {
  const [inBasketData, setInBasketData] = useState<string[]>([]);
  const [countriesDrpDwnList, setCountriesDrpDwnList] = useState<string[]>([]);
  const [dropDown, setDropDown] = useState(false);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
  const [buttonclick, setbuttonclick] = useState(false);
  const [userId, setuserId] = useState(0);
  const [email, setemail] = useState("");
  const router = useRouter();
  const [paidcountries, setpaidcountries] = useState<string[]>([]);

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/login/me`, {
          method: "GET",
          credentials: "include",
        });
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

        if (cartData.cart && cartData.cart.length > 0) {
          setInBasketData(cartData.cart.map((c) => c.cart_country_name));
        } else {
          setInBasketData([]);
        }
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
          !inBasketData.includes(p.countryName) &&
          !paidcountries.includes(p.countryName.toLowerCase())
      )
      .map((e) => e.countryName);
    setCountriesDrpDwnList(filtered);
  }, [countries, inBasketData, paidcountries]);

  const handleSelect = async (country: string) => {
    if (userId === 0) return alert("Login Required!");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/basket/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          cart_slug: country.trim().toLowerCase(),
          cart_country_name: country,
        }),
      });
      if (!response.ok) throw new Error("Failed to add cart");

      setInBasketData((prev) => [...prev, country]);
      setCountriesDrpDwnList((prev) => prev.filter((p) => p !== country));
      setDropDown(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (country: string) => {
    if (userId === 0) return alert("Login Required!");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/basket/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          cart_slug: country.trim().toLowerCase(),
        }),
      });
      if (!response.ok) throw new Error("Failed to delete cart");

      setInBasketData((prev) => prev.filter((p) => p !== country));
      setCountriesDrpDwnList((prev) => [...prev, country]);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = countries.filter((p) =>
    inBasketData.includes(p.countryName)
  );

  const cartCheck = async () => {
    if (inBasketData.length <= 0) return alert("Cart is empty!");
    setbuttonclick(true);
  };

  useEffect(() => {
    const processCheckout = async () => {
      if (!buttonclick) return;
      console.log(userId);
      console.log(email);
      if (userId === 0 || email === "") {
        alert("Login required!");
        setbuttonclick(false);
        return;
      }

      const params = new URLSearchParams({
        country_slug: inBasketData.map((p) => p.toLowerCase()).join(","),
        user_id: userId.toString(),
        quantity: inBasketData.length.toString(),
        email: email,
      });

      router.push(`/purchase/payment?${params.toString()}`);
      setbuttonclick(false);
    };

    processCheckout();
  }, [buttonclick, router, inBasketData, userId, email]);

  return (
    <div className="flex flex-col justify-center items-center py-16 px-3 sm:px-5 md:px-10">
      <h1 className="font-semibold text-center md:py-4 py-2 text-sm sm:text-base md:text-lg">
        Pick countries to explore
      </h1>

      {/* Dropdown */}
      <div className="w-52 md:w-64 lg:w-72 bg-white border rounded px-6 md:px-8 py-4 md:py-6 space-y-1">
        <p className="text-center text-[9px] sm:text-sm">$2 AUD each country</p>
        <div
          ref={dropdownMenuRef}
          className="border rounded px-2 py-1 flex justify-between items-center cursor-pointer"
          onClick={() =>
            countriesDrpDwnList.length > 0 && setDropDown(!dropDown)
          } 
        >
          <span className="font-extralight text-[8px] sm:text-sm">
            {countriesDrpDwnList.length > 0
              ? "Choose country..."
              : "No more country..."}
          </span>
          {countriesDrpDwnList.length > 0 && (
            <span className="ml-2 text-[8px] sm:text-sm">▼</span>
          )}
        </div>

        <div className="bg-gray-100">
          {dropDown &&
            countriesDrpDwnList.map((p, index) => (
              <p
                key={index}
                onClick={() => handleSelect(p)}
                className="px-2 py-1 hover:bg-red-100 cursor-pointer text-[8px] sm:text-sm rounded"
              >
                {p}
              </p>
            ))}
        </div>
      </div>

      {/* Cart Box */}
      <div className="flex justify-center w-full mt-8 md:px-6">
        <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 shadow-2xl bg-white rounded-2xl space-y-3">
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
            Subtotal: <span>$AUD {2 * inBasketData.length}</span>
          </div>

          <div className="flex justify-center mt-3">
            <button
              className="bg-[#6D2608] px-10 sm:px-16 py-2 text-sm sm:text-base text-white rounded-lg"
              onClick={cartCheck}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBox;
