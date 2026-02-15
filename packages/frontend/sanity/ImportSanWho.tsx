import { PortableTextBlock } from "next-sanity";
import { sanityClient } from "./client";

export type WhoData = {
  whoTitle: string;
  whoContent: PortableTextBlock;
};

export async function ImportSanWho() {
  const query = `
            *[_type == "who" ][0]{
              whoTitle,
              whoContent
            }`;

  return await sanityClient.fetch<WhoData>(query);
}
