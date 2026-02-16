import { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import { PortableTextBlock, PortableTextReactComponents } from "next-sanity";


import Image from "next/image";
import { urlFor } from "./urlFor";

export type Post = {
  postTitle: string;
  slug: string;
  content: PortableTextBlock[];
  freeContent: PortableTextBlock[];
  highlightImage: SanityImageSource;
  previewContent: PortableTextBlock[];
};

export const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="font-sans tracking-normal text-base text-left">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-xl sm:text-2xl font-extrabold text-left">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg sm:text-xl font-bold text-left">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base sm:text-lg font-bold text-left">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-gray-400 border-l px-2  italic font-extralight tracking-tight text-heading text-xs sm:text-base">
        {children}
      </blockquote>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="list-disc list-inside pl-6 font-sans tracking-normal text-xs sm:text-base text-left">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="list-decimal list-inside pl-6 font-sans tracking-normal text-xs sm:text-base text-left">
        {children}
      </li>
    ),
  },

  marks: {
    link: ({children, value}) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value.href} rel={rel} className="text-blue-700 underline">
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => (
      <div className="flex justify-center my-4">
        <Image
          src={urlFor(value).quality(100).url()}
          width={300}
          height={300}
          style={{ width: "320", height: "350" }}
          alt=""
        />
      </div>
    ),
    callToAction: ({ value, isInline }) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },
};

export async function ImportSanPost(slug?: string, countrySlug?: string) {
  let params = {};
  let query;
  if (slug) {
    query = `*[_type == "post" && slug.current == $slug]{
            postTitle,
            freeContent,
            content,
            "slug": slug.current,
            highlightImage,
            previewContent
          }`;
    params = { slug };
  } else if (countrySlug) {
    query = `*[_type == "post" && countryName->slug.current == $country]{
            postTitle,
            freeContent,
            content,
            "slug": slug.current,
            highlightImage,
            previewContent
          }`;

    params = { country: countrySlug };
  } else {
    query = `*[_type == "post"]{
            postTitle,
            freeContent,
            content,
            "slug": slug.current,
            highlightImage,
            previewContent
          }`;
  }
  return await sanityClient.fetch<Post[]>(query, params);
}