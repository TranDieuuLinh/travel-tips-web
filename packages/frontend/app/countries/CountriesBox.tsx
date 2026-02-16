"use client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../../sanity/urlFor";
import { Country } from "../../sanity/ImportSanCountry";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { MdVerified } from "react-icons/md";
import { config } from "dotenv";
config({ quiet: true });

type Props = {
  countries: Country[];
};

const CountriesBox = ({ countries }: Props) => {
  const [paidcountries, setpaidcountries] = useState<string[]>([]);
  const [dropDown, setDropDown] = useState(false);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
  const countriesDrpDwnList = ["Country Name", "Paid Countries"];
  const [drpdwnType, setdrpdwntype] = useState<"name" | "paid">("name");
  const [userId, setUserId] = useState(0);

  const clickOutside = (e: MouseEvent) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(e.target as Node)
    ) {
      setDropDown(false);
    }
  };

  const sorted = useMemo(() => {
    return [...countries].sort((a, b) => {
      if (drpdwnType === "paid") {
        const apaid = paidcountries.includes(a.slug) ? 1 : 0;
        const bpaid = paidcountries.includes(b.slug) ? 1 : 0;
        return bpaid - apaid;
      } else {
        return a.countryName.localeCompare(b.countryName);
      }
    });
  }, [countries, drpdwnType, paidcountries]);

  const handleSelect = (p: string) => {
    if (p === "Country Name") {
      setdrpdwntype("name");
      return;
    } else {
      setdrpdwntype("paid");
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

        const paidcountryRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/paidcountries/paidcountryname?userid=${encodeURIComponent(result.id)}`
        );
        setUserId(result.id);
        if (!paidcountryRes.ok) return;
        const paidcountrydata = await paidcountryRes.json();
        setpaidcountries(paidcountrydata.paidcountries);
      } catch (error) {
        console.error(error);
      }
    };
    checklogin();
  }, []);

  return (
    <div className="flex flex-col justify-center w-screen min-h-screen items-center pt-24">
      <div className="relative z-10 items-center">
        <h2 className="font-serif text-center text-[#6D2608] font-bold text-xl md:text-2xl lg:text-3xl pb-2">
          COUNTRIES
        </h2>
        {userId > 0 && (
          <div className="relative rounded w-50 pt-2">
            <div
              ref={dropdownMenuRef}
              className="border rounded-2xl px-2 py-1 flex justify-between items-center cursor-pointer bg-white"
              onClick={() => setDropDown(!dropDown)}
            >
              <div className="flex justify-between w-full text-xs sm:text-base space-x-2 font-light">
                <span>Sort By</span>
                <span>⇅</span>
              </div>
            </div>

            {dropDown && (
              <div className="absolute mt-1 bg-gray-100 w-full rounded-lg overflow-hidden">
                {countriesDrpDwnList.map((p, index) => (
                  <p
                    key={index}
                    onClick={() => handleSelect(p)}
                    className="px-2 py-2 hover:bg-red-100 cursor-pointer text-sm"
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid flex-wrap relative justify-center px-4 sm:px-8 md:px-13 pt-10 gap-8 font-sans font-bold pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((country) => (
          <Link
            href={`/countries/${country.slug}`}
            key={country.slug}
            className="shrink-0 w-full flex"
          >
            <div className="flex flex-col shadow-2xl rounded-2xl overflow-hidden flex-1 ">
              <div className="relative w-full aspect-3/2 ">
                <Image
                  src={urlFor(country.imageCover).quality(60).url()}
                  alt={country.countryName}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <div className="flex flex-col p-4 flex-1">
                <div className="flex items-center font-serif text-[#6D2608] font-bold text-xl md:text-2xl lg:text-3xl">
                  {country.countryName}
                  {paidcountries.includes(country.slug) && (
                    <MdVerified className="text-[#0AB149] ml-2" size={22} />
                  )}
                </div>

                <p className="font-serif font-light text-base mt-2">
                  {country.countryDescription}
                </p>
              </div>
              <button
                onClick={() => <Link href={`/countries/${country.slug}`} />}
                className="bg-[#6D2608] hover:bg-[#6d260883] text-white font-normal text-sm md:text-sm lg:text-base py-2 px-12 sm:px-5 flex items-center justify-center cursor-pointer"
              >
                READ MORE
                <span className="ml-2 sm:w-5 sm:h-5 flex items-center justify-center">
                  →
                </span>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CountriesBox;
