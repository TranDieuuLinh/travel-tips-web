import { ImportSanPost } from "@/sanity/ImportSanPost";
import MainCountry from "./MainCountry";

type Props = {
  params: {
    slug: string;
    specifc: string;
  };
};
export const revalidate = 60;

const Page = async ({ params }: Props) => {
  const { slug, specifc } = await params;
  const posts = await ImportSanPost(specifc.trim().toLowerCase());
  return (
    <div>
      <MainCountry countrySlug={slug as string} posts={posts} />
    </div>
  );
};

export default Page;
