"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const logoutUser = async () => {
      try {
        await fetch("http://localhost:3000/logout", {
          method: "POST",
          credentials: "include",
        });
        window.location.reload();
        router.push("/");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    logoutUser();
  }, [router]);

  return <div>logout page</div>;
};

export default Page;
