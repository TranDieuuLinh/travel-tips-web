"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { config } from "dotenv";
config({ quiet: true });

const Navbar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [openEditName, setOpenEditName] = useState(false);
  const [dropdownMenu, setdropdownMenu] = useState(false);
  const [newName, setNewName] = useState("");
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const fetchEditName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/login/update-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newName: newName,
          email: email,
        }),
      });

      if (response.status === 200) {
        setName(newName);
        setNewName("");
        setdropdownMenu(false);
      } else alert("Fail to edit name");
    } catch (error) {
      console.error(error);
      alert("Fail to edit name");
    }
  };

  const clickOutside = (e: MouseEvent) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(e.target as Node)
    ) {
      setdropdownMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", clickOutside);

    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/login/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (!data.name || !data.email) return;

        setName(data.name.trim());
        setEmail(data.email);
      } catch (error) {
        console.error("Fetch threw error:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <nav className="justify-between items-center top-0 absolute z-5 w-full flex px-3 sm:px-7 py-4 bg-linear-to-b from-black/50 to-black/0 text-white font-semibold font-sans text-[8px] sm:text-[12px] md:text-sm lg:text-[16px]">
      <div className="flex items-center lg:space-x-1">
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-9 md:h-9 lg:w-12 lg:h-12 relative">
          <Image
            src="/icon.png"
            alt="Logo Image"
            fill
            className="object-contain"
             sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
        {!name && <Link href="/">TRAVEL WITH KNOWLEDGE</Link>}
        {name && <div className="hover:text-orange-50">
        {name &&  <Link href="/" className={isActive("/") ? "text-neutral-300" : ""}>
        TRAVEL WITH KNOWLEDGE
          </Link>}
        </div>}
      </div>

      <div className="flex md:space-x-4 space-x-1">
        <div className="hover:text-orange-50">
        {!name &&  <Link href="/" className={isActive("/") ? "text-neutral-300" : ""}>
            HOME
          </Link>}
        </div>
        <div className="hover:text-orange-50">
          <Link
            href="/countries"
            className={isActive("/countries") ? "text-neutral-300" : ""}
          >
            COUNTRIES
          </Link>
        </div>
        <div className="hover:text-orange-50">
          <Link
            href="/purchase"
            className={isActive("/purchase") ? "text-neutral-300" : ""}
          >
            PURCHASE
          </Link>
        </div>
        {name ? (
          <div ref={dropdownMenuRef} className="w-fit relative">
            <button
              onClick={() => {
                setdropdownMenu(!dropdownMenu);
                setOpenEditName(false);
              }}
              className="inline-flex hover:text-orange-50 cursor-pointer"
            >
             {name.trim().toUpperCase()} ▼
            </button>
            {dropdownMenu && (
              <div className="sm:mt-4 absolute bg-neutral-200 rounded p-1 sm:p-3 sm:w-30 w-16 end-0 flex flex-col md:space-y-4 space-y-2 text-[9px] sm:text-sm">
                <div
                  className="text-gray-500 "
                  onClick={() => setOpenEditName(true)}
                >
                  <div className="underline cursor-pointer">
                    {openEditName && (
                      <div className="flex flex-col justify-center ">
                        <form onSubmit={fetchEditName}>
                          <input
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={"New name..."}
                            type="text"
                            className="w-full border p-0.5 sm:p-1  text-[8px] sm:text-[13px]"
                          ></input>
                          <button
                            type="submit"
                            className="w-fit mt-1  text-black md:px-1"
                          >
                            Edit
                          </button>
                        </form>
                      </div>
                    )}
                    {!openEditName && "Edit Name"}
                  </div>
                </div>
                <Link
                  className="text-red-400 underline"
                  href="/logout"
                  onClick={() => setdropdownMenu(false)}
                >
                  Log Out
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/signin"
            className={isActive("/signin") ? "text-neutral-300" : ""}
          >
            SIGN INnnn
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
