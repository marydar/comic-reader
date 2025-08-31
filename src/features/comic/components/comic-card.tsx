import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/thumbnail.webp"

interface ComicCardProps {
    title: string;
    views: number;
    thumbnail: string | null;
}
export default function ComicCard({title, views, thumbnail}: ComicCardProps) {
  return (
    <div className='w-[150px] h-[240px] md:w-[250px] md:h-[400px] bg-primary rounded-2xl cursor-grab'>
        <img src={thumbnail? thumbnail: undefined} alt={"comic1"} className='w-full  object-cover h-[200px] md:h-[320px] rounded-t-2xl rounded-b-0'/>
        <div className='flex flex-col justify-between w-full p-1 px-4 md:p-4 md:px-8 gap-0'>
            <p className='text-[10px] md:text-[18px] text-primary-foreground text-center truncate px-0 md:px-2'>{title}</p>
            <p className='text-[8px] md:text-[10px] text-primary-foreground/80 text-center'>{views} views</p>
        </div>
    </div>
  )
}
