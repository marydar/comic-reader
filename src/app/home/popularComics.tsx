import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/orv.jpg"
import NavigateNext from "@/components/navigate-next"
import NavigateBefore from "@/components/navigate-before"

const PopularComics = () => {
  return (
    <div className='lg:p-10 p-4 md:pt-6 flex w-full h-[200px] md:h-[400px]  lg:h-[700px] text-foreground text-center cursor-grab'>
        <div className='bg-blue-950 w-full relative rounded-3xl'>
            <Image src={myImage} alt={"comic1"} className='w-full  object-cover h-full rounded-4xl'/>
            <div className='w-full h-[50px] md:h-[100px]  absolute bottom-1 flex justify-between items-center px-8 md:px-12 py-4'>
                <div className=' w-[100px] h-[20px] md:w-[500px] md:h-[60px] bg-primary/40 rounded-4xl text-primary text-left text-[10px] md:text-[22px] truncate  px-2 md:px-8 flex  items-center'>
                    Omniscient reader viewpoint 
                </div>
                <div className='flex gap-2 items-center justify-center'>
                    <NavigateBefore/>
                    <NavigateNext/>
                </div>
            </div>
        </div>
        {/* Popular Comics */}
    </div>
  )
}

export default PopularComics