import { PortableText, PortableTextBlock } from "next-sanity";
import { sanityClient } from "../../sanity/client";
import { urlFor } from "../../sanity/urlFor";
import Image from "next/image";
import { SanityImageSource } from "@sanity/image-url";

const Highlight = async () => {
  type Post = {
    postTitle: string;
    slug: string;
    freeContent: PortableTextBlock[];
    highlightImage: SanityImageSource;
  };

  const query = `*[_type=="post" && slug.current == "china-reality"][0]{postTitle, freeContent, "slug":slug.current, highlightImage}`;
  const fetchPost = await sanityClient.fetch<Post>(query);
  const imageUrl = urlFor(fetchPost.highlightImage).url();

  return (
    <div className="w-full p-15">
      <h1 className="font-sans ">HIGHLIGHT POST </h1>
      <div className=" w-full ">
        <h2 className="font-serif text-[#6D2608] font-bold text-3xl py-4">
          {fetchPost.postTitle.toUpperCase()}
        </h2>
        <div className="flex justify-center items-center gap-8">
          <div className="flex-2/3">
            {" "}
            <PortableText value={fetchPost.freeContent}></PortableText>
          </div>
          <div className="flex-1/3  ">
            <Image src={imageUrl} alt={""} width={500} height={1000} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Highlight;
