import CountriesBox from "./CountriesBox";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";

export const revalidate = 60; 

const Page = async () => {

  const countries = await ImportSanCountry();
  return (
    <div>
      <CountriesBox countries={countries}/>
    </div>
  );
};

export default Page;
