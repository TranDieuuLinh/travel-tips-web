import { ImportSanCountry } from "../../../sanity/ImportSanCountry";
import Image from "next/image";
import { urlFor } from "@/sanity/urlFor";
import { ImportSanPost } from "@/sanity/ImportSanPost";
import { PortableText } from "next-sanity";
import Link from "next/link";

type Props = {
  slug: string;
};

const EachCountry = ({ slug }: Props) => {
  const { countries, loading } = ImportSanCountry(slug.trim().toLowerCase());
  const countrySlug = slug;
  const { post } = ImportSanPost(undefined, slug.trim().toLowerCase());
  const country = countries[0];
  if (loading) return <p>Loading...</p>;

  return (
    <div className="px-20">
      <div className="flex flex-wrap px-8 py-4 font-sans font-bold justify-center">
        {!loading && country && (
          <div
            key={country.slug}
            className="flex flex-col shrink-0 border-2"
          >
            <Image
              src={urlFor(country.imageCover).quality(100).url()}
              alt={country.countryName}
              height={150}
              width={180}
              style={{ width: "160px", height: "100px" }}
              className="object-cover"
            />
            <p className="text-center py-4">{country.countryName} section</p>
          </div>
        )}
      </div>
      <div className=" flex-col  px-10 gap-4 font-sans border-2  text-xl py-4  ">
        <div className="w-full justify-center flex font-extralight">
          <p className="tracking-widest">POSTS OVERVIEW</p>
        </div>
        <hr />
        {!post || post.length ===0 && <div className="text-center pt-4"> No posts available for this country yet</div>}
        {post &&
          post.map((p) => (
            <div key={p.slug} className="w-full text-[16px]">
              <div className="flex space-x-3 px-10 ">
                <div className="justify-center h-full flex items-center">
                  <Image
                    src={urlFor(p.highlightImage).quality(100).url()}
                    alt={p.postTitle}
                    width={150}
                    height={100}
                    style={{ width: "90px", height: "100px" }}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <Link href={`/countries/${countrySlug}/${p.slug}`}>
                    <h1 className="underline">{p.postTitle}</h1>
                  </Link>

                  <div className="font-extralight tracking-wide">
                    <PortableText value={p.previewContent} />
                  </div>
                </div>
              </div>

              <hr className="mt-4 w-full" />
            </div>
          ))}
      </div>
      <div></div>
    </div>
  );
};

export default EachCountry;
