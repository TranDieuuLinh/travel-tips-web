"use client";
import Link from "next/link";

import Image from "next/image";
import { urlFor } from "../../sanity/urlFor";
import { ImportSanCountry } from "../../sanity/ImportSanCountry";


const CountriesBox = () => {
  const {countries,loading} = ImportSanCountry()

  
  return (
    <div className="flex flex-wrap justify-center items-center h-screen px-8 py-24 gap-6 font-sans font-bold">
      {loading  && <p className="text-center text-xl">Loading...</p>}
      {!loading && countries &&
        countries.map((country) => (
          <Link href={`/countries/${country.slug}`} key={country.slug}>
            <div
              key={country.slug}
              className="flex flex-col shrink-0 border rounded-2xl overflow-hidden"
            >
              <Image
                src={urlFor(country.imageCover).quality(100).url()}
                alt={country.countryName}
                height={200}
                width={270}
                style={{ width: "270px", height: "200px" }}
                className="object-cover"
              />
              <p className="text-center py-4">{country.countryName}</p>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default CountriesBox;
