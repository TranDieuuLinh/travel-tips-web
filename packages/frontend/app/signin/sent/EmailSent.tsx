import Image from "next/image";
const SignInBox = () => {
  return (
    <div className="relative h-screen w-screen bg-[#7C7C7C] flex items-center justify-center">
      <Image
        src="/SignInBg.png"
        alt="Sign In Background"
        fill
        className="absolute h-full w-full object-cover"
      />
      <div className="flex-col absolute flex items-center justify-center font-sans px-7 pt-7 md:px-15 md:pt-15 pb-8 font-light  bg-white rounded-2xl border-2 ">
        <div className="space-y-2 text-center">
          <p className="text-xs md:text-base">We’ve sent you an authentication link 📩</p>
          <p className="font-extralight py-3 text-xs md:text-base">or</p>
          <a
            href="https://mail.google.com"
            rel="noopener noreferrer"
            className="text-[10px] md:text-sm text-blue-400"
          >
            Open Gmail
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInBox;
