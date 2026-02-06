"use client";
import { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import { useState, useEffect } from "react";
import { PortableTextBlock } from "next-sanity";

type Post = {
  postTitle: string;
  slug: string;
  content:PortableTextBlock[];
  freeContent: PortableTextBlock[];
  highlightImage: SanityImageSource;
  previewContent: PortableTextBlock[];
};

export const ImportSanPost = (slug?: string, countrySlug?:string) => {
  const [post, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
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
        }
        else {
          query = `*[_type == "post"]{
            postTitle,
            freeContent,
            content,
            "slug": slug.current,
            highlightImage,
            previewContent
          }`;
        }
        const posts = await sanityClient.fetch<Post[]>(query, params);
        setPosts(posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [slug]);

  return { post, loading };
};
