import PurchaseBox from "./PurchaseBox";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";

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
