import React from 'react'

export default function HeroSkeleton() {
  return (
    <div className='lg:p-10 p-4 md:pt-6 flex w-full h-[200px] md:h-[400px]  lg:h-[700px] text-foreground text-center cursor-grab'>
        <div className= 'w-full h-full bg-primary/40 rounded-3xl'></div>
    </div>
  )
}
