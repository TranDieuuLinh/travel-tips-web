"use client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../../sanity/urlFor";
import { Country } from "../../sanity/ImportSanCountry";

type Props = {
  countries: Country[];
};

const CountriesBox = ({ countries }: Props) => {
  return (
    <div className="flex flex-wrap justify-center items-center px-4 sm:px-6 md:px-12 pt-18 pb-10 gap-4 sm:gap-6 md:gap-8 font-sans font-bold min-h-screen">
      {countries.map((country) => (
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
              {country.countryName}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CountriesBox;
