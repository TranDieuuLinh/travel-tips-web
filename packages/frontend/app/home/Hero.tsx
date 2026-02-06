"use client";
import heroPicture from "../Image/Hero.png";
import { useRouter } from "next/navigation";
import { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "../../sanity/client";
import Image from "next/image";
import { urlFor } from "../../sanity/urlFor";
import { useEffect, useState } from "react";
import Link from "next/link";

type Country = {
  countryName: string;
  imageCover: SanityImageSource;
  slug: string;
  highlight: boolean;
};

const Hero = () => {
  const router = useRouter();
  const navigatetoCountries = () => router.push("/countries");
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const query = `
        *[_type == "country" && highlight == true ]{
          countryName,
          imageCover,
          "slug": slug.current,
          highlight
        }
      `;

      const countries = await sanityClient.fetch<Country[]>(query);
      setCountries(countries);
    };
    fetchCountries();
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <Image
        src={heroPicture}
        alt="Hero Picture"
        className="object-cover overflow-hidden -z-10"
        fill
      />

      <div className="flex-col absolute inset-0 flex items-center justify-center font-serif space-y-4 text-[#6D2608] font-semibold text-6xl pb-50">
        <h1 className="tracking-widest first-letter:text-8xl first-letter:font-medium">
          FOLLOW OUR TIPS
        </h1>
        <h1 className="tracking-widest">EXPLORE THE WORLD</h1>
      </div>

      <div className="flex flex-wrap bottom-10 px-5 absolute z-5 font-sans font-bold text-white space-x-8 w-full items-center justify-center">
        {countries?.map((country) => (
          <Link href={`/countries/${country.slug}/`} key={country.slug}><div
            key={country.slug}
            className="flex flex-col items-end space-y-1 shrink-0"
          >
            <p className="text-right pr-2">{country.countryName}</p>

            <Image
              src={urlFor(country.imageCover).height(300).auto("format").quality(100).url()}
              alt={country.countryName}
              height={200}
              width={4000}
              style={{ width: "auto", height: "200px" }}
              className="rounded-xl object-cover"
            />
          </div>
          </Link>
        ))}
        <div className="flex items-center">
          <button
            onClick={navigatetoCountries}
            className=" bg-[#6D2608] text-white ps-5 pe-2 py-2 rounded-full flex items-center justify-center hover:bg-[#6d2608c1] font-normal text-xs"
          >
            MORE
            <span className="ml-2 bg-white text-[#6D2608] rounded-full w-5 h-5 flex items-center justify-center">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
