import CountriesBox from "./CountriesBox";
import { ImportSanCountry } from "@/sanity/ImportSanCountry";
import type { Metadata } from 'next'


export const metadata:Metadata = {
  title:'All Countries Tips',
  description:'Check Out All The Countries Tips We Have'
}

export const revalidate = 300;

const Page = async () => {
  const countries = await ImportSanCountry();
  const sortedCountries = countries.sort((a, b) =>
    a.countryName.localeCompare(b.countryName)
  );
  return (
    <>
      <CountriesBox countries={sortedCountries} />
    </>
  );
};

export default Page;
