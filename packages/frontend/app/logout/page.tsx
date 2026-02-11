"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { config } from "dotenv";
config({quiet:true});

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const logoutUser = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLICE_APP_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });
        window.location.href = "/";
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    logoutUser();
  }, [router]);

  return <div>logout page</div>;
};

export default Page;
