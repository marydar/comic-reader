import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/image.png"
import Link from 'next/link'
interface ChapterCardProps {
    _id: string;
    title: string;
    views: number;
    likes: number;
    createdAt: string;
    thumbnail: string | null;
}
export default function ChapterCard() {
  return (
    <div className='flex items-center justify-start min-w-[150px] max-w[150px] h-[240px] md:w-full md:max-h-[70px] md:min-h-[70px] bg-background border-1 border-primary rounded-2xl cursor-grab'>
      <Link href="/">
      <div className='flex items-center justify-center w-full  gap-4 px-4'>
        <Image src={myImage} alt={"comic1"} className='object-center   rounded-2xl ' width={50} height={50}/>
        <div className='flex flex-col justify-between w-full gap-1'>
            <p className='text-[10px] md:text-[16px] text-foreground text-left truncate px-0'>chapter one</p>
            <p className='text-[8px] md:text-[12px] text-foreground/80 text-left'>2025-sep-15 </p>
        </div> 
      </div>
      </Link>
    </div>
  )
}
