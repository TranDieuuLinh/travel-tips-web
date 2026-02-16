"use client";

import { Country } from "../../../sanity/ImportSanCountry";
import Image from "next/image";
import { urlFor } from "@/sanity/urlFor";
import { Post } from "@/sanity/ImportSanPost";
import Link from "next/link";

type Props = {
  slug: string;
  posts: Post[];
  countries: Country[];
};

const EachCountry = ({ countries, posts, slug }: Props) => {
  const countrySlug = slug;
  const country = countries[0];

  return (
    <div className="md:flex md:px-10">
      <div className="flex md:w-1/2 justify-center font-sans font-bold shadow py-6">
        {country && (
          <div className="flex flex-col w-full md:px-4 px-3 justify-center">
            <div
              className="overflow-hidden relative items-center justify-center flex"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={urlFor(country.imageCover).quality(100).url()}
                alt={country.countryName}
                width={450}
                height={503}
                style={{ objectFit: "cover" }}
              />
            </div>
            <p className="text-center font-serif text-[#6D2608] font-bold text-xl md:text-2xl lg:text-4xl">
              {country.countryName.toUpperCase()}
            </p>
            <p className=" font-light text-sm text-center md:text-left md:text-base mt-2 md:px-4">
              {country.countryDescription}
            </p>
          </div>
        )}
      </div>
      <div className="flex md:w-1/2 flex-col font-sans rounded-lg sm:px-0 py-3">
        <div className="lg:px-8 mx-6 md:mx-0 py-4">
          {!posts || posts.length === 0 ? (
            <div className="text-center text-sm sm:text-base">
              No posts available for this country yet
            </div>
          ) : (
            posts.map((p) => (
              <div key={p.slug} className="w-full pb-4">
                <Link href={`/countries/${countrySlug}/${p.slug}`}>
                  <div className="md:flex md:items-start">
                    <div
                      className="relative w-full md:w-[58%] lg:w-1/2 h-0"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <Image
                        src={urlFor(p.highlightImage).quality(100).url()}
                        alt={p.postTitle}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Post Text */}
                    <div className="mt-2 md:mt-0 md:ml-4 md:w-[55%] lg:w-[50%] space-y-2">
                      <h1 className="font-serif text-[#6D2608] text-base md:text-lg lg:text-xl">
                        {p.postTitle.toUpperCase()}
                      </h1>
                      <div className="font-sans font-extralight text-sm lg:text-base">
                        {p.previewContent}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EachCountry;
