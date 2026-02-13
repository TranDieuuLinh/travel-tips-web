import Image from "next/image";

const Who = () => {
  return (
    <div className="bg-[#FBF8F2] px-4 py-5 md:p-10 justify-between items-center flex flex-row">
      <div className="w-1/2 justify-center flex">
        <Image src="/WhoPic.png" alt="Who Are We Picture" width={200} height={240} priority className="w-26 h-26.5 sm:w-36.5 sm:h-34.5 lg:h-37.5 xl:h-52 xl:w-50"/>
      </div>
      <div className="w-1/2 justify-center flex flex-col md:pe-4">
        <h2 className="font-serif text-[#6D2608] font-bold text-base sm:text-xl md:text-2xl lg:text-3xl pb-2">
          {" "}
          WHO ARE WE?
        </h2>
        <span className="font-sans font-light text-[10px] md:text-base xl:text-lg flex lg:leading-relaxed ">
          We are just travel across and .....
        </span>
      </div>
    </div>
  );
};

export default Who;
