import Image from "next/image";

const Who = () => {
  return (
    <div className="bg-[#FBF8F2] px-4 py-5 md:p-10 justify-between items-center flex flex-row">
      <div className="w-1/2 justify-center flex">
        <Image src="/WhoPic.png" alt="Who Are We Picture" width={200} height={240} priority className="w-26 h-26.5 sm:w-36.5 sm:h-34.5 lg:h-37.5 xl:h-52 xl:w-50"/>
      </div>
      <div className="w-1/2 justify-center flex flex-col md:pe-4">
        <h1 className="font-serif font-extralight text-sm md:text-xl lg:text-2xl xl:text-3xl text-[#7D3E22] pb-2">
          {" "}
          WHO ARE WE?
        </h1>
        <span className="font-sans font-light text-[10px] md:text-base xl:text-lg flex lg:leading-relaxed ">
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
