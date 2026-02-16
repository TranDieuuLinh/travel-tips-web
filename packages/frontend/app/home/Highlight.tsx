"use client";
import { PortableText } from "next-sanity";
import { Post } from "../../sanity/ImportSanPost";
import { urlFor } from "../../sanity/urlFor";
import Image from "next/image";
import Link from "next/link";
import { myPortableTextComponents } from "../../sanity/ImportSanPost";
type Props = {
  posts: Post[];
};

const Highlight = ({ posts }: Props) => {
  const fetchPost = posts[0];

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-80 py-8">
      <h1 className="font-sans text-[10px] sm:text-base md:text-lg font-semibold md:mb-2">
        HIGHLIGHT POST
      </h1>

      {fetchPost && (
        <div className="w-full">
          <Link href={`/countries/china/${fetchPost.slug}`}>
          <h2 className="font-serif text-[#6D2608] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6">
            {fetchPost.postTitle.toUpperCase()}
          </h2>
          </Link>

          <div>
            <Image
              src={urlFor(fetchPost.highlightImage).quality(60).url()}
              alt={fetchPost.postTitle}
              width={400}
              height={400}
              className="w-38 sm:w-50 md:w-70 lg:w-90 mr-2 md:mr-4 md:mb-4  object-cover float-left"
            />
            <span className="font-sans font-light text-[16px] md:text-base lg:text-lg md:leading-relaxed space-y-2">
              <PortableText value={fetchPost.freeContent} components={myPortableTextComponents}/>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Highlight;
