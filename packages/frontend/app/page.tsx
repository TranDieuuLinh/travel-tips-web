import Hero from "./home/Hero.tsx";
import Who from "./home/Who.tsx";
import Highlight from "./home/Highlight.tsx";

export default function page() {
  return (
    <div>
      <Hero />
      <hr />
      <Who />
      <hr />
      <Highlight />
    </div>
  );
}
