"use client";

import { Country } from "../../../sanity/ImportSanCountry";
import Image from "next/image";
import { urlFor } from "@/sanity/urlFor";
import { Post } from "@/sanity/ImportSanPost";
import { PortableText } from "next-sanity";
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
    <div className="px-8 sm:px-10 md:px-12 lg:px-20">
      <div className="flex flex-wrap justify-center gap-6 mb-8 font-sans font-bold">
        {country && (
          <div className="flex flex-col shrink-0 border-2 rounded-lg overflow-hidden w-37 sm:w-37.5 md:w-45 lg:w-50">
            <div className="relative w-full h-25.5 md:h-28 lg:h-30">
              <Image
                src={urlFor(country.imageCover).quality(70).url()}
                alt={country.countryName}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center py-2 sm:py-3 text-sm sm:text-base md:text-lg lg:text-xl">
              {country.countryName} section
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 font-sans border-2 rounded-lg px-4 sm:px-6 md:px-8 py-6">
        <div className="w-full text-center">
          <p className="tracking-widest text-sm sm:text-base md:text-lg font-extralight">
            POSTS OVERVIEW
          </p>
        </div>
        <hr />

        {!posts || posts.length === 0 ? (
          <div className="text-center text-sm sm:text-base">
            No posts available for this country yet
          </div>
        ) : (
          posts.map((p) => (
            <div
              key={p.slug}
              className="w-full text-base sm:text-base md:text-lg"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                {/* Post Image */}
                <div className="shrink-0 w-full sm:w-22.5 md:w-30 h-30 relative">
                  <Image
                    src={urlFor(p.highlightImage).quality(100).url()}
                    alt={p.postTitle}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Post Text */}
                <div className="flex-1 space-y-2">
                  <Link href={`/countries/${countrySlug}/${p.slug}`}>
                    <h1 className="underline text-sm sm:text-base md:text-lg lg:text-xl">
                      {p.postTitle}
                    </h1>
                  </Link>

                  <div className="font-sans font-extralight text-[10px] sm:text-sm md:text-sm xl:text-lg md:leading-relaxed">
                    <PortableText value={p.previewContent} />
                  </div>
                </div>
              </div>
              <hr className="mt-6 w-full" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EachCountry;
