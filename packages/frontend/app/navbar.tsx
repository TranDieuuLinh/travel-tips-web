"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Image/Logo.png";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    console.log("Navbar mounted");

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/login/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!data.name || !data.email) {
          return;
        }

        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Fetch threw error:", error);
      }
    };

    fetchUserData();
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "COUNTRIES", path: "/countries" },
    { name: name ? `HEY, ${name}` : "SIGNIN", path: name ? "#" : "/signin" },
    { name: name ? "LOGOUT" : "", path: name ? "/logout" : "" },
  ];

  return (
    <nav className="justify-between items-center top-0 absolute z-5 w-full flex px-7 py-4 bg-linear-to-b from-black/50 to-black/0 text-white font-semibold font-sans text-sm">
      <div className="flex items-center space-x-2">
        <Image src={Logo} alt="Logo Image" width={33} />
        <Link href="/">TRAVEL WITH KNOWLEDGE</Link>
      </div>

      <div className="flex space-x-4">
        {navLinks.map((link) => (
          <Link
            href={link.path}
            key={link.name}
            className={isActive(link.path) ? "text-neutral-300" : ""}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
