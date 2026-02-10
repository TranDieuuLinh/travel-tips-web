import { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import { PortableTextBlock } from "next-sanity";

export type Post = {
  postTitle: string;
  slug: string;
  content: PortableTextBlock[];
  freeContent: PortableTextBlock[];
  highlightImage: SanityImageSource;
  previewContent: PortableTextBlock[];
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
