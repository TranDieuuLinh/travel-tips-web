"use client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../../sanity/urlFor";
import { Country } from "../../sanity/ImportSanCountry";
import { useEffect, useState } from "react";
import { MdPaid } from "react-icons/md";
import React from "react";

type Props = {
  countries: Country[];
};

const CountriesBox = ({ countries }: Props) => {
  const [paidcountries, setpaidcountries] = useState<string[]>([]);
  const [dropDown, setDropDown] = useState(false);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
  const countriesDrpDwnList = ["Country Name", "Paid Countries"];
  const [drpdwnType, setdrpdwntype] = useState<"name" | "paid">("name");

  const clickOutside = (e: MouseEvent) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(e.target as Node)
    ) {
      setDropDown(false);
    }
  };

  const sorted = [...countries].sort((a, b) => {
    if (drpdwnType === "paid") {
      const apaid = paidcountries.includes(a.slug) ? 1 : 0;
      const bpaid = paidcountries.includes(b.slug) ? 1 : 0;
      return bpaid - apaid;
    } else {
      return a.countryName.localeCompare(b.countryName);
    }
  });

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
        const response = await fetch(`http://localhost:3000/login/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) return;
        const result = await response.json();
        if (!result.id || !result.email) return;

        const paidcountryRes = await fetch(
          `http://localhost:3000/paidcountries/paidcountryname?userid=${encodeURIComponent(result.id)}`
        );
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
    <div className="flex flex-col justify-center min-h-screen items-center pt-18">
      <div className="w-52 md:w-64 lg:w-72 bg-white shadow rounded px-6 md:px-8 py-4 md:py-6 space-y-1">
        <div
          ref={dropdownMenuRef}
          className="border rounded px-2 py-1 flex justify-between items-center cursor-pointer"
          onClick={() => setDropDown(!dropDown)}
        >
         <div className="flex justify-between w-full">
         <span>Sort By </span>
         <span>▼</span>
          </div> 
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
      <div className="flex flex-wrap justify-center items-center px-4 sm:px-6 md:px-12 pt-10 pb-10 gap-4 sm:gap-6 md:gap-8 font-sans font-bold ">
        {sorted.map((country) => (
          <Link href={`/countries/${country.slug}`} key={country.slug}>
            <div className="flex flex-col shrink-0 border rounded-2xl overflow-hidden w-48 sm:w-40 md:w-60 lg:w-80 xl:w-67.5">
              <div className="relative w-full h-30 sm:h-30 md:h-44 lg:h-60 xl:h-50">
                <Image
                  src={urlFor(country.imageCover).quality(100).url()}
                  alt={country.countryName}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <p className="text-center py-2 sm:py-3 text-[10px] sm:text-sm md:text-base lg:text-lg">
                {country.countryName}{" "}
                {paidcountries.length > 0 &&
                  paidcountries.includes(country.slug) && (
                    <span className=" absolute m-1">
                      <MdPaid className="text-[#0AB149]" />
                    </span>
                  )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CountriesBox;
