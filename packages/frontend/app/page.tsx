import Hero from "./home/Hero.tsx";
import Who from "./home/Who.tsx";
import Highlight from "./home/Highlight.tsx";
import { HighlightCountries } from "@/sanity/ImportSanCountryHighlight.tsx";
import { ImportSanPost } from "@/sanity/ImportSanPost.tsx";
export const revalidate = 60;

export default async function page() {
  const highlightcountries = await HighlightCountries();
  const posts = await ImportSanPost("china-reality");
  return (
    <>
      <Hero countries={highlightcountries} />
      <hr />
      <Who />
      <hr />
      <Highlight posts={posts} />
    </>
  );
}
