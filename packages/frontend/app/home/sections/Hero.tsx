import heroPicture from '../../Image/Hero.png'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className='relative h-screen w-screen'>

      <Image src = {heroPicture} alt = "Hero Picture" className='object-cover overflow-hidden -z-10' fill/>    

      <div className='flex-col absolute inset-0 flex items-center justify-center font-serif space-y-4 text-[#6D2608] font-semibold text-4xl pb-50'>
        <h1 className='tracking-widest first-letter:text-6xl first-letter:font-medium'>FOLLOW OUR TIPS</h1>
        <h1 className='tracking-widest'>EXPLORE THE WORLD</h1>
      </div>

      <div className="flex bottom-20 px-5 absolute z-5 font-sans font-bold text-white space-x-5">
        <div className="flex-1 shrink-0 space-y-1 ">
          <p className='text-right pr-2'>China</p>
          <Image  src = {heroPicture}  alt="Description 1" className="w-full h-auto object-cover rounded-xl" />
        </div>
        <div className="flex-1 space-y-1 ">
          <p className='text-right pr-2'>Kyrgyzstan</p>
          <Image  src = {heroPicture}  alt="Description 1" className="w-full h-auto object-cover rounded-xl" />
        </div>
        <div className="flex-1 space-y-1 ">
          <p className='text-right pr-2'>China</p>
          <Image  src = {heroPicture}  alt="Description 1" className="w-full h-auto object-cover rounded-xl" />
        </div>
        <div className="flex-1 space-y-1 ">
          <p className='text-right pr-2'>China</p>
          <Image  src = {heroPicture}  alt="Description 1" className="w-full h-auto object-cover rounded-xl" />
        </div>
        
        <div className="flex items-center">
        <button className=" bg-[#6D2608] text-white ps-5 pe-2 py-2 rounded-full flex items-center justify-center hover:bg-[#6d2608c1] font-normal text-xs">
          MORE 
          <span className="ml-2 bg-white text-[#6D2608] rounded-full w-5 h-5 flex items-center justify-center">→</span>
        </button>
      </div>
  
    </div>


      

      
    </div>
  )
}

export default Hero