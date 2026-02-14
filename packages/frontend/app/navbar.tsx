"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const navRight = [
    { path: "/", name: "HOME" },
    { path: "/countries", name: "COUNTRIES" },
    { path: "/purchase", name: "PURCHASE" },
  ];

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(e.target as Node)
      ) {
        setDropdownMenu(false);
      }
    };

    window.addEventListener("click", clickOutside);

    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, []);

  /* Fetch user */
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

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.name && data.email) {
          setName(data.name.trim());
          setEmail(data.email);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-linear-to-b from-black/50 to-black/0 text-white font-sans">
      <div className="flex items-center justify-between px-3 sm:px-7 py-4 font-semibold">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-12 md:w-10 md:h-13 relative">
            <Link href="/">
              <Image
                src="/icon.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          <Link href="/" className="font-semibold text-sm lg:text-[17px]">
            TRAVEL WITH KNOWLEDGE
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5 text-sm lg:text-[17px]">
          {navRight.map((p) => (
            <Link
              href={p.path}
              key={p.path}
              className={`hover:text-orange-50 ${isActive(p.path) ? "text-neutral-300" : ""}`}
            >
              {p.name}
            </Link>
          ))}

          {/* User Menu */}
          {name ? (
            <div ref={dropdownMenuRef} className="relative">
              <button
                onClick={() => setDropdownMenu(!dropdownMenu)}
                className="hover:text-orange-50"
              >
                HEY, {name.toUpperCase()} ▼
              </button>

              {dropdownMenu && (
                <div className="absolute right-0 mt-3 bg-neutral-200 rounded p-3 w-32 flex flex-col space-y-3 text-sm">
                  <Link
                    href={{
                      pathname: "/signin/editname",
                      query: { email },
                    }}
                    className="text-gray-600"
                    onClick={() => setDropdownMenu(false)}
                  >
                    Edit Name
                  </Link>

                  <Link
                    href="/logout"
                    className="text-red-400"
                    onClick={() => setDropdownMenu(false)}
                  >
                    Log Out
                  </Link>
                </div>
              )}
            </div>
          ) : loading ? (
            <span className="animate-spin">🌀</span>
          ) : (
            <Link
              href="/signin"
              className={`hover:text-orange-50 ${
                isActive("/signin") ? "text-neutral-300" : ""
              }`}
            >
              SIGN IN
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-xl mb-1"
        >
          ☰
        </button>
      </div>
      <div className="relative">
        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-linear-to-b from-black/0 to-black/30 backdrop-blur flex flex-col items-center space-y-4 py-6 text-sm w-full">
            {name && (
              <button className="hover:text-orange-50">
                HEY, {name.toUpperCase()} 👋
              </button>
            )}
            {navRight.map((p) => (
              <Link
                href={p.path}
                key={p.path}
                onClick={() => setMobileMenu(false)}
                className="hover:text-orange-50"
              >
                {p.name}
              </Link>
            ))}

            {name ? (
              <>
                <Link
                  href={{
                    pathname: "/signin/editname",
                    query: { email },
                  }}
                  onClick={() => setMobileMenu(false)}
                >
                  EDIT NAME
                </Link>

                <Link
                  href="/logout"
                  onClick={() => setMobileMenu(false)}
                  className="text-red-300"
                >
                  LOG OUT
                </Link>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setMobileMenu(false)}
                className="hover:text-orange-50"
              >
                SIGN IN
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
