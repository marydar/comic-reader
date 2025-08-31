import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/thumbnail.webp"

export default function ComicCard() {
  return (
    <div className='w-[120px] h-[200px] md:w-[250px] md:h-[400px] bg-primary rounded-2xl cursor-grab'>
        <Image src={myImage} alt={"comic1"} className='w-full  object-cover h-[160px] md:h-[320px] rounded-t-2xl rounded-b-0'/>
        <div className='flex flex-col justify-between w-full p-1 px-4 md:p-4 md:px-8 gap-0'>
            <p className='text-[10px] md:text-[18px] text-primary-foreground text-center truncate px-0 md:px-2'>omniscient reader viewpoint</p>
            <p className='text-[8px] md:text-[10px] text-primary-foreground/80 text-center'>230 views</p>
        </div>
    </div>
  )
}
