import EachCountry from "./EachCountry";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";
import { ImportSanPost } from "@/sanity/ImportSanPost";

type Props = {
  params: { slug: string };
};

export const revalidate = 60;

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const countries = await ImportSanCountry(slug.trim().toLowerCase());
  const posts = await ImportSanPost(undefined, slug.trim().toLowerCase());

  return (
    <div className="py-16">
      <EachCountry countries={countries} posts={posts} slug={slug} />
    </div>
  );
}
