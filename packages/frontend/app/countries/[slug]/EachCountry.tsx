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
              <div key={p.slug} className="w-full pb-2">
                <div className="md:ml-2">
                  {/* Image */}
                  <div
                    className="float-left w-1/2 mr-3 mb-2 relative"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <Image
                      src={urlFor(p.highlightImage).quality(100).url()}
                      alt={p.postTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="space-y-2 pb-4">
                    <Link href={`/countries/${countrySlug}/${p.slug}`}>
                      <h1 className="font-serif text-[#6D2608] text-[13px] md:text-base lg:text-xl">
                        {p.postTitle.toUpperCase()}
                      </h1>
                    </Link>

                    <div className="font-sans font-extralight text-sm lg:text-base">
                      <PortableText value={p.previewContent} />
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EachCountry;
