import EachCountry from "./EachCountry";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";
import { ImportSanPost } from "@/sanity/ImportSanPost";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/urlFor";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const countries = await ImportSanCountry(slug.trim().toLowerCase());

  const countryImage = countries[0].imageCover
    ? urlFor(countries[0].imageCover).url()
    : "https://travelknowled.ge/SignInBg.png";

  return {
    title: countries[0].countryName,
    description: countries[0].countryDescription,
    openGraph: {
      type: "article",
      url: `https://travelknowled.ge/countries/${countries[0].slug}`,
      images: [
        {
          url: countryImage,
          width: 1200,
          height: 630,
          alt: countries[0].countryName,
        },
      ],
    },
  };
}

type Props = {
  params: { slug: string };
};

export const revalidate = 300;

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const countries = await ImportSanCountry(slug.trim().toLowerCase());
  const posts = await ImportSanPost(undefined, slug.trim().toLowerCase());
  const sortedPosts = posts.sort((a, b) =>
    a.postTitle.localeCompare(b.postTitle)
  );
  return (
    <div className="pt-20">
      <EachCountry countries={countries} posts={sortedPosts} slug={slug} />
    </div>
  );
}
