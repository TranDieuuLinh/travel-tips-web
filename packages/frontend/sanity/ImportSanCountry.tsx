"use client";

import { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import { useState, useEffect } from "react";

type Country = {
  countryName: string;
  imageCover: SanityImageSource;
  slug: string;
  highlight: boolean;
};

export const ImportSanCountry = (slug?: string) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        let params = {};
        let query;
        if (slug) {
          query = `*[_type == "country" && slug.current == $slug]{
            countryName,
            imageCover,
            "slug": slug.current,
            highlight
          }`;
          params = { slug };

        } else {
          query = `*[_type == "country"]{
            countryName,
            imageCover,
            "slug": slug.current,
            highlight
          }`;
        }
        const countries = await sanityClient.fetch<Country[]>(query,params);
        setCountries(countries);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [slug]);

  return { countries, loading };
};
