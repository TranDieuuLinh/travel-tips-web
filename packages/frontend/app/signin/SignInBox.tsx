import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import isEmail from "validator/lib/isEmail";

const SignInBox = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/auth/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.status === 200) router.push("/signin/sent");
      else alert("Error sending email. Please try again.");
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error sending email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#7C7C7C] flex items-center justify-center">
      <Image
        src="/SignInBg.png"
        alt="Sign In Background"
        fill
        className="absolute h-full w-full object-cover"
      />
      <div className="flex-col absolute flex items-center justify-center font-sans font-light px-10 md:px-15 md:pt-15 pt-10 space-y-6 bg-white rounded-2xl border-2 ">
        <div className="space-y-0 text-center text-xs sm:text-base">
          <p >We will send a link to authenticate </p>
          <p> your account 📩</p>
        </div>
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="md:ps-6 ps-4 pe-10 md:pe-20 py-2 md:py-3 rounded-lg border bg-white text-xs sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6D2608] md:mx-12 py-2.5 mb-8 rounded-3xl text-xs sm:text-base text-white font-semibold hover:bg-black transition"
          >
            {loading ? "Sending..." : "Send Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInBox;
