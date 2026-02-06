"use client";
import { useParams } from "next/navigation";
import EachCountry from "./EachCountry";

export default function CountryPage() {
  const { slug } = useParams();

  return (
    <div className="px-8 py-24">
      <EachCountry slug={slug as string} />
    </div>
  );
}
