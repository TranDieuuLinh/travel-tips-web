import { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

export type Country = {
  countryName: string;
  imageCover: SanityImageSource;
  slug: string;
  highlight: boolean;
  countryDescription:string
};

export async function ImportSanCountry (slug?: string) {
  
        let params = {};
        let query;
        if (slug) {
          query = `*[_type == "country" && slug.current == $slug]{
            countryName,
            imageCover,
            "slug": slug.current,
            highlight,
            countryDescription
          }`;
          params = { slug };

        } else {
          query = `*[_type == "country"]{
            countryName,
            imageCover,
            "slug": slug.current,
            highlight,
            countryDescription
          }`;
        }
        return await sanityClient.fetch<Country[]>(query,params);
  
};
