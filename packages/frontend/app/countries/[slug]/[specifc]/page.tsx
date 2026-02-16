import { ImportSanPost } from "@/sanity/ImportSanPost";
import MainCountry from "./MainCountry";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/urlFor";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { specifc } = await params;
  const posts = await ImportSanPost(specifc.trim().toLowerCase());
  const fetchPost = posts[0];
  const images = fetchPost.highlightImage
    ? urlFor(fetchPost.highlightImage).url()
    : "https://travelknowled.ge/SignInBg.png";

  return {
    title: fetchPost.postTitle,
    description: fetchPost.previewContent,
    openGraph: {
      type: "article",
      images: [
        {
          url: images,
          width: 1200,
          height: 630,
          alt: fetchPost.postTitle,
        },
      ],
    },
  };
}

type Props = {
  params: {
    slug: string;
    specifc: string;
  };
};
export const revalidate = 300;

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
