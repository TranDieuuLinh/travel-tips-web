"use client";
import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";
import { urlFor } from "@/sanity/urlFor";
import Image from "next/image";

const PurchaseBox = () => {
  const [inBasketData, setInBasketData] = useState<string[]>(() => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("inBasketCountry");
    return data ? JSON.parse(data) : [];
  });

  const [dropDown, setDropDown] = useState(false);
  const { countries } = ImportSanCountry();
  const [countriesDrpDwnList, setCountriesDrpDwnList] = useState<string[]>([]);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);

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

    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, []);

  useEffect(() => {
    if (!countries.length) return;
    const data = localStorage.getItem("inBasketCountry");
    const basket = data ? JSON.parse(data) : [];
    const filtered = countries
      .filter((p) => !basket.includes(p.countryName))
      .map((e) => e.countryName);
    setCountriesDrpDwnList(filtered);
    console.log(filtered);
  }, [countries]);

  useEffect(() => {
    localStorage.setItem("inBasketCountry", JSON.stringify(inBasketData));
  }, [inBasketData]);

  const handleSelect = (country: string) => {
    setInBasketData((prev) => {
      if (prev.includes(country)) return prev;
      return [...prev, country];
    });

    setCountriesDrpDwnList(countriesDrpDwnList.filter((p) => country !== p));
  };

  const handleDelete = (country: string) => {
    setInBasketData(inBasketData.filter((p) => p !== country));

    setCountriesDrpDwnList((prev) => {
      if (prev.includes(country)) return prev;
      return [...prev, country];
    });
  };

  const filtered = countries.filter((p) =>
    inBasketData.includes(p.countryName)
  );

  return (
    <div className="flex flex-col justify-center h-full pt-30 pb-24">
      <h1 className="font-semibold text-center pb-2 text-xl">
        Pick countries to explore
      </h1>
    
      <div className="w-fit mx-auto px-15 py-10 space-y-4 bg-white border-2 rounded-2xl">
        <p className="text-center">$2 AUD each country</p>

        <div>
          <div
            ref={dropdownMenuRef}
            className="border px-3 rounded flex justify-between cursor-pointer"
            onClick={() => setDropDown(!dropDown)}
          >
            <div className="font-extralight">
              {countriesDrpDwnList.length > 0 ? (
                <div>
                  Choose country... <span className="ps-10">▼</span>
                </div>
              ) : (
                "No more country..."
              )}
            </div>
          </div>

          {dropDown &&
            countriesDrpDwnList.map((p, index) => (
              <p
                key={index}
                onClick={() => handleSelect(p)}
                className="bg-gray-100 px-3 py-1 hover:bg-red-100 cursor-pointer"
              >
                {p}
              </p>
            ))}
        </div>
      </div>

      <div className="flex justify-center pt-10">
        <div className="w-200 p-10 shadow-2xl">
          {filtered.map((e) => (
            <div key={e.slug} className="flex justify-between py-3">
              <Image
                src={urlFor(e.imageCover).url()}
                alt={e.countryName}
                width={200}
                height={200}
                style={{ width: "130px", height: "100px" }}
              />
              <div className="text-end">
                <button>
                  <RiDeleteBin5Fill
                    onClick={() => handleDelete(e.countryName)}
                    className="text-red-600 text-lg"
                  />
                </button>
                <p className="font-bold">{e.countryName}</p>
                <span className="font-extralight"> $AUD 2</span>
              </div>
            </div>
          ))}

          <hr className="my-5" />

          <div className="flex justify-between font-extralight px-2">
            Subtotal: <span>$AUD {2 * inBasketData.length}</span>
          </div>

          <div className="flex justify-center mt-3">
            <button className="bg-[#6D2608] px-20 py-2 text-sm text-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBox;
