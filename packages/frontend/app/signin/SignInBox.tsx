import Image from "next/image";
import SignInBg from "../Image/SignInBg.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import isEmail from "validator/lib/isEmail";

const SignInBox = () => {
  const [data, setData] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!isEmail(email)) {
      alert("Please enter a valid email address.");
      return window.location.reload();
    }

    try {
      setLoading(true);
      e.preventDefault();
      const response = await fetch("http://localhost:3000/auth/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      setLoading(false);
      setData(response.status);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(500);
    }
  };

  useEffect(() => {
    if (data === 200) {
      router.push("/signin/sent");
    } else if (data === 0) {
      return;
    } else {
      alert("Error sending email. Please try again.");
      window.location.reload();
    }
  }, [data, router]);

  return (
    <div className="relative h-screen w-screen bg-[#7C7C7C] flex items-center justify-center">
      <Image
        src={SignInBg}
        alt="Sign In Background"
        fill
        className="absolute h-full w-full object-cover"
      />
      <div className="flex-col absolute flex items-center justify-center font-sans font-light px-15 pt-15  space-y-6 bg-white rounded-2xl border-2 ">
        <div className="space-y-0 text-center">
          <p>We will send a link to authenticate </p>
          <p> your account 📩</p>
        </div>
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="ps-6 pe-20 py-3 rounded-lg border bg-white "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6D2608] mx-12 py-2.5 mb-8 rounded-3xl text-white font-semibold hover:bg-black transition"
          >
            {loading ? "Sending..." : "Send Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInBox;
