import Hero from "./home/Hero.tsx";
import Who from "./home/Who.tsx";
import Highlight from "./home/Highlight.tsx";
import { HighlightCountries } from "@/sanity/ImportSanCountryHighlight.tsx";
import { ImportSanPost } from "@/sanity/ImportSanPost.tsx";
import { ImportSanWho } from "@/sanity/ImportSanWho.tsx";
export const revalidate = 300;

export default async function page() {
  const highlightcountries = await HighlightCountries();
  const who = await ImportSanWho();
  const posts = await ImportSanPost("china-reality");
  return (
    <div className="pb-10">
      <Hero countries={highlightcountries} />
      <hr />
      <Who whopost={who}/>
      <hr />
      <Highlight posts={posts} />
    </div>
  );
}
