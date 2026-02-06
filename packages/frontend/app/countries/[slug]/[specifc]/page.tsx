"use client";
import { useParams } from "next/navigation";
import MainCountry from "./MainCountry";
import { spec } from "node:test/reporters";

const Page = () => {
  const { specifc } = useParams();
  return (
    <div>
      <MainCountry slug={specifc as string} />
    </div>
  );
};

export default Page;
