import CountriesBox from "./CountriesBox";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";

export const revalidate = 60; 

const Page = async () => {

  const countries = await ImportSanCountry();
  const sortedCountries = countries.sort((a,b) =>a.countryName.localeCompare(b.countryName));
  return (
    <div>
      
      <CountriesBox countries={sortedCountries}/>
    </div>
  );
};

export default Page;
