import { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

export type Country = {
  countryName: string;
  imageCover: SanityImageSource;
  slug: string;
  highlight: boolean;
};

export async function HighlightCountries(highlight?: boolean) {
  const query = `
            *[_type == "country" && highlight == true ]{
              countryName,
              imageCover,
              "slug": slug.current,
              highlight
            }`;


  return await sanityClient.fetch<Country[]>(query);
}
