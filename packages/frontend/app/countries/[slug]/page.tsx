import EachCountry from "./EachCountry";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";
import { ImportSanPost } from "@/sanity/ImportSanPost";

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
