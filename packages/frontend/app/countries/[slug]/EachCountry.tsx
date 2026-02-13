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
    <div className="flex md:px-10">
      <div className="flex w-1/2 justify-center font-sans font-bold ">
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
            <p className="text-center font-serif text-[#6D2608] font-bold text-base sm:text-xl md:text-2xl lg:text-4xl">
              {country.countryName.toUpperCase()}
            </p>
            <p className=" font-light text-[10px] md:text-base mt-2 md:px-4">
              {country.countryDescription}
            </p>
          </div>
        )}
      </div>
      <div className="flex w-1/2 flex-col font-sans rounded-lg pl-2">
        <hr/>
        <div>
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
                <div className="flex flex-col sm:flex-row gap-2 pt-2 md:ml-2 items-center md:items-start">
                  {/* Post Image */}
                  <div
                    className="shrink-0 w-1/2 h-full relative"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <Image
                      src={urlFor(p.highlightImage).quality(100).url()}
                      alt={p.postTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Post Text */}
                  <div className=" space-y-2 px-2 py-4">
                    <Link href={`/countries/${countrySlug}/${p.slug}`}>
                      <h1 className="font-serif text-[#6D2608] text-center md:text-left text-xs  md:text-sm lg:text-xl">
                        {p.postTitle.toUpperCase()}
                      </h1>
                    </Link>

                    <div className="font-sans font-extralight text-[9px] md:text-xs lg:text-base pt-2">
                      <PortableText value={p.previewContent} />
                    </div>
                  </div>
                </div>
                <hr className=" w-full" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EachCountry;
