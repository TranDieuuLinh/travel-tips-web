import PurchaseBox from "./PurchaseBox";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Countries",
  description: "Each Country Cost Is Only $2AUD",
};

export const revalidate = 300;
const page = async () => {
  const countries = await ImportSanCountry();
  return (
    <div>
      <PurchaseBox countries={countries} />
    </div>
  );
};

export default page;
