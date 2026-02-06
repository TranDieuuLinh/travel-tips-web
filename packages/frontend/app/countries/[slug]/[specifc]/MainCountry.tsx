"use client";
import { ImportSanPost } from "@/sanity/ImportSanPost";
import { urlFor } from "@/sanity/urlFor";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { useState } from "react";
type Props = {
  slug: string;
};

const MainCountry = ({ slug }: Props) => {
  const { post, loading } = ImportSanPost(slug.trim().toLowerCase());
  const fetchPost = post[0];
  const [paid, setpaid] = useState(false);
  if (loading) return <p>Loading... </p>;

  return (
    <>
      {!loading && fetchPost && (
        <div className="p-12 flex flex-col justify-center items-center ">
          <div className=" pt-10">
            <Image
              src={urlFor(fetchPost.highlightImage).quality(100).url()}
              alt={""}
              width={300}
              height={400}
            />
          </div>
          <h2 className="font-serif text-[#6D2608] font-bold text-3xl py-5">
            {fetchPost && fetchPost.postTitle.toUpperCase()}
          </h2>
          <div className="font-sans tracking-normal">
            <PortableText value={fetchPost.freeContent}></PortableText>
          </div>
          {paid && (
            <div className="font-sans tracking-normal">
              <PortableText value={fetchPost.content}></PortableText>
            </div>
          )}
        </div>
      )}
      {!paid && (
            <div className="flex-col justify-between items-center bottom-0  space-y-5 w-full flex  py-18 bg-linear-to-b from-black/0 to-black/50 font-extrabold font-sans text-3xl">
              <p>Experience more for only $2!</p>
              <button className="bg-[#6D2608] px-20 py-2 text-sm text-white">DISCOVER</button>
            </div>
          )}
    </>
  );
};

export default MainCountry;
