import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/nature.jpg"

const PopularComics = () => {
  return (
    <div className='p-10 flex w-full h-[700px] text-foreground text-center'>
        <div className='bg-blue-950 w-full relative rounded-3xl'>
            {/* <div className='object-contain w-full h-full'> */}
                <Image src={myImage} alt={"comic1"} className='w-full  object-cover h-full rounded-4xl'/>
            {/* </div> */}
            <div className='w-full h-[100px]  absolute bottom-1 flex justify-between items-center px-12 py-4'>
                <div className='w-[500px] h-[60px] bg-primary/60 rounded-4xl text-foreground text-left text-[24px] truncate px-8 flex  items-center'>
                    Comic Name 
                </div>
                <div className='flex gap-2 items-center justify-center'>
                    <div className='rounded-full bg-primary/60 w-[60px] h-[60px] text-center flex items-center justify-center'>
                        pre
                    </div>
                    <div className='rounded-full bg-primary/60 w-[60px] h-[60px] text-center flex items-center justify-center'>
                        next
                    </div>
                </div>
            </div>
            
        </div>
        {/* Popular Comics */}
    </div>
  )
}

export default PopularComics