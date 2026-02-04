import React from 'react'
import imageUrlBuilder, { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";


export const urlFor = (source:SanityImageSource) => {
    const builder = imageUrlBuilder(sanityClient)

  return builder.image(source);
}

