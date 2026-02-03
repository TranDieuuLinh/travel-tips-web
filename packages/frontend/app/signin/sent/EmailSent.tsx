import Image from "next/image";
import SignInBg from "../../Image/SignInBg.png";
const SignInBox = () => {
  return (
    <div className="relative h-screen w-screen bg-[#7C7C7C] flex items-center justify-center">
      <Image
        src={SignInBg}
        alt="Sign In Background"
        fill
        className="absolute h-full w-full object-cover"
      />
      <div className="flex-col absolute flex items-center justify-center font-sans px-15 pt-15 pb-10 font-light  bg-white rounded-2xl border-2 ">
        <div className="space-y-2 text-center">
          <p>Authentication link has been sent to your email!</p>
          <p className="font-extralight py-3">or</p>
          <a
            href="https://mail.google.com"
            rel="noopener noreferrer"
            className="text-sm text-blue-400"
          >
            Open Gmail
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInBox;
