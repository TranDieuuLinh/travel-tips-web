"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { normalizeNameForCompare, sanitizeUserName } from "@/lib/userName";

const EditNameBox = () => {
  const { data: authUser } = useAuth();
  const currentName = authUser?.name ?? "";
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEditName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitized = sanitizeUserName(newName);
    if (!sanitized) {
      alert("Please enter a valid name.");
      return;
    }
    if (
      currentName &&
      normalizeNameForCompare(currentName) === normalizeNameForCompare(sanitized)
    ) {
      alert("That name is the same as your current name.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/login/update-name`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newName: sanitized }),
        }
      );

      if (response.ok) {
        alert("New Name Is Set ✅");
        window.location.href = "/";
      } else {
        let msg = "Fail to edit name ❌";
        try {
          const data = (await response.json()) as { message?: string };
          if (data?.message) msg = data.message;
        } catch {
          /* ignore */
        }
        alert(msg);
        if (response.status !== 400) window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert("Fail to edit name");
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
        <div className="space-y-0 text-center">
          <h1 className="font-bold text-[14px] sm:text-xl pb-2">EDIT NAME</h1>
        </div>
        <form className="flex flex-col space-y-6" onSubmit={fetchEditName}>
          <input
            type="text"
            required
            placeholder="Enter your new name..."
            className="md:ps-6 ps-4 pe-10 md:pe-20 py-2 md:py-3 rounded-lg border bg-white text-xs sm:text-base"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6D2608] md:mx-12 py-2.5 mb-8 rounded-3xl text-xs sm:text-base text-white font-semibold hover:bg-black transition"
          >
            {loading ? "Editing..." : "Edit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNameBox;
