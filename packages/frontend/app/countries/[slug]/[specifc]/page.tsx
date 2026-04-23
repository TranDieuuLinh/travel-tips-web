import { ImportSanPost } from "@/sanity/ImportSanPost";
import MainCountry from "./MainCountry";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/urlFor";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { specifc,slug } = await params;
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
      url: `https://travelknowled.ge/countries/${slug}/${fetchPost.slug}`,
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
export const dynamic = "force-dynamic";

async function getIsPaidCountry(countrySlug: string): Promise<boolean> {
  const cookieHeader = (await cookies()).toString();
  if (!cookieHeader) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/paidcountries/paidcountryname`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { paidcountries?: string[] };
    return (data.paidcountries ?? []).includes(countrySlug.trim().toLowerCase());
  } catch {
    return false;
  }
}

const Page = async ({ params }: Props) => {
  const { slug, specifc } = await params;
  const posts = await ImportSanPost(specifc.trim().toLowerCase());
  const paid = await getIsPaidCountry(slug);

  const safePosts = paid
    ? posts
    : posts.map((p) => ({
        ...p,
        content: [],
      }));
  return (
    <div>
      <MainCountry countrySlug={slug as string} posts={safePosts} paid={paid} />
    </div>
  );
};

export default Page;
