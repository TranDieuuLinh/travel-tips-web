import React from 'react'
import EditNameBox from './EditNameBox'
import type { Metadata } from 'next'


export const metadata:Metadata = {
  title:'Edit Name',
  description:'Change Your Name Here'
}


const page = () => {
  return (
    <div><EditNameBox/></div>
  )
}

export default page