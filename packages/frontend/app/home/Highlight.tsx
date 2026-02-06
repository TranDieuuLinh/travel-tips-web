"use client";
import { PortableText } from "next-sanity";
import { ImportSanPost } from "../../sanity/ImportSanPost";
import { urlFor } from "../../sanity/urlFor";
import Image from "next/image";

const Highlight = () => {
  const { post,loading } = ImportSanPost("china-reality");
  const fetchPost = post[0];
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full p-15">
      <h1 className="font-sans ">HIGHLIGHT POST </h1>
      {!loading && fetchPost && (<div className=" w-full ">
        <h2 className="font-serif text-[#6D2608] font-bold text-3xl py-4">
          {fetchPost && fetchPost.postTitle.toUpperCase()}
        </h2>
        <div className="flex justify-center items-center gap-8">
          <div className="flex-2/3">
            <PortableText value={fetchPost.freeContent}></PortableText>
          </div>
          <div className="flex-1/3  ">
            <Image
              src={urlFor(fetchPost.highlightImage).quality(100).url()}
              alt={""}
              width={500}
              height={1000}
            />
          </div>
        </div>
      </div>)}
      
    </div>
  );
};

export default Highlight;
