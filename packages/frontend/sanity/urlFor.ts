import  { createImageUrlBuilder,SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";


export const urlFor = (source:SanityImageSource) => {
    const builder = createImageUrlBuilder(sanityClient)

  return builder.image(source);
}

