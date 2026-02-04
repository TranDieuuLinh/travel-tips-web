import React from "react";
import WhoPic from "../Image/WhoPic.png";
import Image from "next/image";

const Who = () => {
  return (
    <div className="bg-[#FBF8F2] p-10 justify-between items-center flex flex-row">
      <div className="w-1/2 justify-center flex">
        <Image src={WhoPic} alt="Who Are We Picture" width={200} />
      </div>
      <div className="w-1/2 justify-center flex flex-col pe-4">
        <h1 className="font-serif font-extralight text-2xl text-[#7D3E22] pb-2">
          {" "}
          WHO ARE WE?
        </h1>
        <span className="font-sans font-light flex leading-relaxed text-justify">
          The tips that we have at the moment is through our real experience to
          meet the people, to make the most of the travel and through the
          hardship that we learn through our travel including the most
          interesting activities that you must do from the country and the
          public transport to take around including apps to use in certain
          countries. Experience we have is from talking to the local, do a lot
          of readings and researching.
        </span>
      </div>
    </div>
  );
};

export default Who;
