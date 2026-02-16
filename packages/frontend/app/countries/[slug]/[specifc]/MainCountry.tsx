"use client";
import { Post, myPortableTextComponents } from "@/sanity/ImportSanPost";
import { urlFor } from "@/sanity/urlFor";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { config } from "dotenv";
config({ quiet: true });

type Props = {
  countrySlug: string;
  posts: Post[];
};

const MainCountry = ({ countrySlug, posts }: Props) => {
  const fetchPost = posts[0];
  const [paid, setpaid] = useState(false);
  const [userId, setUserId] = useState(0);
  const router = useRouter();
  const movetoPayment = () => {
    const countryslug = encodeURIComponent(countrySlug);
    const encuserId = encodeURIComponent(userId)

    const url = userId > 0 ? `/purchase?countryslug=${countryslug}&uid=${encuserId}` : "/purchase";

    router.push(url);
  };

  useEffect(() => {
    const checklogin = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/login/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) return;
        const result = await response.json();
        if (!result.id || !result.email) return;

        setUserId(result.id);

        const paidcountryRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/paidcountries/paidcountryname?userid=${encodeURIComponent(result.id)}`
        );
        if (!paidcountryRes.ok) return;
        const paidcountrydata = await paidcountryRes.json();
        const paidcountries = paidcountrydata.paidcountries;
        if (paidcountries.includes(countrySlug)) return setpaid(true);
        else return setpaid(false);
      } catch (error) {
        console.error(error);
      }
    };
    checklogin();
  }, [countrySlug]);

  return (
    <>
      {fetchPost && (
        <div className="mx-auto max-w-[1600px] flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-80 pb-18 md:pt-24  sm:py-12 gap-6">
          {/* Image */}
          <div className=" max-w-50 md:max-w-130 lg:w-85">
            <Image
              src={urlFor(fetchPost.highlightImage).quality(70).url()}
              alt={fetchPost.postTitle}
              width={500}
              height={400}
              className="w-full h-auto rounded object-cover"
            />
          </div>

          {/* Post Title */}
          <h2 className="font-serif text-[#6D2608] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center sm:py-5">
            {fetchPost.postTitle.toUpperCase()}
          </h2>

          {/* Free Content */}
          <div className="font-sans tracking-normal text-base md:text-lg lg:text-xl text-left">
            <PortableText
              value={fetchPost.freeContent}
              components={myPortableTextComponents}
            />
          </div>

          {/* Paid Content */}
          {paid && (
            <div className="font-sans tracking-normal text-base md:text-lg lg:text-xl text-left pt-2">
              <PortableText
                value={fetchPost.content}
                components={myPortableTextComponents}
              />
            </div>
          )}
        </div>
      )}
      {!paid && (
        <div className="flex-col justify-between items-center bottom-0  space-y-5 w-full flex  py-18 bg-linear-to-b from-black/0 to-black/50 font-extrabold font-sans text-white text-lg sm:text-xl md:text-2xl">
          <p>Experience more for only $2!</p>
          <button
            className="bg-[#6D2608] px-8 sm:px-16 py-2 sm:py-3 text-sm sm:text-base rounded-md hover:bg-[#6d2608c1] cursor-pointer"
            onClick={movetoPayment}
          >
            DISCOVER
          </button>
        </div>
      )}
    </>
  );
};

export default MainCountry;
