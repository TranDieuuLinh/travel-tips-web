 import Hero from './home/sections/Hero.tsx'
 import Who from './home/sections/Who.tsx';
 import Highlight from './home/sections/Highlight.tsx';

export default function page() {


  return (
   <div>
    <Hero/>
    <hr/>
    <Who/>
    <hr/>
    <Highlight/>
   </div>
  );
}