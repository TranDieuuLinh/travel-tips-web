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
  const [dropdownMenu, setdropdownMenu] = useState(false);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
  const [loading,setloading] = useState(true);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/login/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) return setloading(false);;

        const data = await response.json();

        if (!data.name || !data.email) return;

        setName(data.name.trim());
        setEmail(data.email);
      } catch (error) {
        console.error("Fetch threw error:", error);
      } finally {
        return setloading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <nav className="justify-between items-center top-0 absolute z-5 w-full flex px-1 sm:px-7 py-4 bg-linear-to-b from-black/50 to-black/0 text-white font-semibold font-sans text-[9px] md:text-[12px] lg:text-[17px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex items-center lg:space-x-1">
        <div className="w-8 h-12 md:w-10 md:h-13 lg:w-13 lg:h-15 relative">
          <Link href="/">
            <Image
              src="/icon.png"
              alt="Logo Image"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </Link>
        </div>
        {!name && <Link href="/">TRAVEL WITH KNOWLEDGE</Link>}
        {name && (
          <div className="hover:text-orange-50">
            {name && (
              <Link
                href="/"
                className={isActive("/") ? "text-neutral-300" : ""}
              >
                TRAVEL WITH KNOWLEDGE
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="flex md:space-x-7 space-x-1.5">
        <div className="hover:text-orange-50">
          {!name && (
            <Link href="/" className={isActive("/") ? "text-neutral-300" : ""}>
              HOME
            </Link>
          )}
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
              }}
              className="inline-flex hover:text-orange-50 cursor-pointer"
            >
              {name.trim().toUpperCase()} ▼
            </button>
            {dropdownMenu && (
              <div className="sm:mt-4 absolute bg-neutral-200 rounded p-1 sm:p-3 sm:w-30 w-16 end-0 flex flex-col md:space-y-4 space-y-2 text-[9px] sm:text-base">
                <Link
                  className="text-gray-500"
                  onClick={() => setdropdownMenu(false)}
                  href={{pathname:"/signin/editname", query:{email:email}}}
                >
                  Edit Name
                </Link>
                <Link
                  className="text-red-400"
                  href="/logout"
                  onClick={() => setdropdownMenu(false)}
                >
                  Log Out
                </Link>
              </div>
            )}
          </div>
        ) : (
          loading? 
          <span className="animate-spin">🌀</span>:
          <Link
            href="/signin"
            className={isActive("/signin") ? "text-neutral-300" : ""}
          >
            SIGN IN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
