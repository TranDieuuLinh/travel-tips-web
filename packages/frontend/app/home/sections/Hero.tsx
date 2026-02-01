import React from 'react'
import heroPicture from '../Image/Hero.png'
import Image from 'next/image'

const Hero = () => {
  return (
    <div>
    <Image
        src = {heroPicture}
        alt = "Hero Picture" 
        width = {500}
        height = {300}
    />    
        </div>
  )
}

export default Hero