"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { urlFor } from "../../sanity/urlFor";
import { Country } from "@/sanity/ImportSanCountryHighlight";
import Link from "next/link";

type Props = {
  countries: Country[];
};

const Hero = ({ countries }: Props) => {
  const router = useRouter();
  const navigatetoCountries = () => router.push("/countries");

  return (
    <div className="flex w-full min-h-screen">
      <Image
        src="/Hero.png"
        alt="Hero Picture"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 flex flex-col pb-60 xl:pb-40 sm:pb-0 items-center justify-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8 text-[#6D2608] font-serif font-extrabold sm:font-semibold text-[21px] sm:text-2xl md:text-3xl lg:text-5xl  px-4 text-center ">
        <h1 className="tracking-widest first-letter:text-4xl sm:first-letter:text-3xl md:first-letter:text-4xl lg:first-letter:text-7xl  first-letter:font-medium">
          FOLLOW OUR TIPS
        </h1>
        <h1 className="tracking-widest">
          EXPLORE THE WORLD
        </h1>
      </div>

      <div className="absolute bottom-5 sm:bottom-6 md:bottom-8 lg:bottom-10 xl:bottom-12 w-full flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-2 sm:px-4 z-10 text-white font-serif">
        {countries?.map((country) => (
          <Link href={`/countries/${country.slug}/`} key={country.slug}>
            <div className="flex flex-col items-end space-y-1 shrink-0 w-32.5 sm:w-35 md:w-40 lg:w-45 xl:w-50">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-right">
                {country.countryName}
              </p>
              <Image
                src={urlFor(country.imageCover).quality(50).url()}
                alt={country.countryName}
                width={300}
                height={200}
                className="rounded-xl object-cover w-full h-20.5 sm:h-27.5 md:h-32.5 lg:h-37.5 xl:h-45 hover:scale-110"
              />
            </div>
          </Link>
        ))}

        <div className="flex items-center mt-2 sm:mt-0">
          <button
            onClick={navigatetoCountries}
            className="bg-[#6D2608] hover:bg-[#6d260883] text-white font-normal text-[10px] sm:text-sm md:text-sm lg:text-base py-2 px-12 sm:px-5 rounded-full flex items-center justify-center cursor-pointer"
          >
            MORE
            <span className="ml-2 sm:bg-white sm:text-[#6D2608] sm:rounded-full sm:w-5 sm:h-5 flex items-center justify-center">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
