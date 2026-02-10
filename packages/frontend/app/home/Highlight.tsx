"use client";
import { PortableText } from "next-sanity";
import { Post } from "../../sanity/ImportSanPost";
import { urlFor } from "../../sanity/urlFor";
import Image from "next/image";

type Props = {
  posts: Post[];
};

const Highlight = ({ posts }: Props) => {
  const fetchPost = posts[0];

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 py-8">
      {/* Section Title */}
      <h1 className="font-sans text-[10px] sm:text-base md:text-lg font-semibold md:mb-2">
        HIGHLIGHT POST
      </h1>

      {fetchPost && (
        <div className="w-full">
          {/* Post Title */}
          <h2 className="font-serif text-[#6D2608] font-bold text-base sm:text-xl md:text-2xl lg:text-3xl mb-6">
            {fetchPost.postTitle.toUpperCase()}
          </h2>

          <div>
            <Image
              src={urlFor(fetchPost.highlightImage).quality(100).url()}
              alt={fetchPost.postTitle}
              width={400}
              height={400}
              className="w-40 sm:w-50 md:w-70 lg:w-100 mr-3 mb-2 md:mr-4 md:mb-4  object-cover float-left"
            />
            <span className="font-sans font-light text-[10px] md:text-base xl:text-lg md:leading-relaxed">
              <PortableText value={fetchPost.freeContent} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Highlight;
