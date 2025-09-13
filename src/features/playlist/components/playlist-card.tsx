import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/thumbnail.webp"
import Link from 'next/link'
interface PlaylistCardProps {
    _id: string;
    title: string;
    numberOfComics: number;
    thumbnail: string | null;
}
export default function PlaylistCard({_id,title, numberOfComics, thumbnail}: PlaylistCardProps) {
  return (
    <div className="relative min-w-[150px] max-w[150px] h-[240px] md:min-w-[250px] md:max-w-[250px] md:h-[400px]">
    <div className='min-w-[140px] max-w[140px] h-[220px] md:min-w-[230px] md:max-w-[230px] md:h-[380px] bg-primary/60 rounded-2xl cursor-grab absolute top-0 left-2  md:top-0 md:left-4 z-10'>
      {/* <img src={thumbnail? thumbnail: undefined} alt={"comic1"} className='w-full  object-cover h-[180px] md:h-[300px] rounded-t-2xl rounded-b-0 opacity-40'/> */}
    </div>
    <div className='min-w-[140px] max-w[140px] h-[220px] md:min-w-[230px] md:max-w-[230px] md:h-[380px] bg-primary/60 rounded-2xl cursor-grab absolute top-1 left-1 md:top-2 md:left-2 z-20'>
    {/* <img src={thumbnail? thumbnail: undefined} alt={"comic1"} className='w-full  object-cover h-[180px] md:h-[300px] rounded-t-2xl rounded-b-0 opacity-60'/> */}
    </div>    
    <div className='min-w-[140px] max-w[140px] h-[220px] md:min-w-[230px] md:max-w-[230px] md:h-[380px] bg-primary rounded-2xl cursor-grab absolute top-2 left-0 md:top-4 md:left-0 z-30'>
      <Link href={`/comicList/${_id}`}>
        <img src={thumbnail? thumbnail: undefined} alt={"comic1"} className='w-full  object-cover h-[180px] md:h-[300px] rounded-t-2xl rounded-b-0'/>
        <div className='flex flex-col justify-between w-full p-1 px-4 md:p-4 md:px-8 gap-0'>
            <p className='text-[10px] md:text-[18px] text-primary-foreground text-center truncate px-0 md:px-2'>{title}</p>
            <p className='text-[8px] md:text-[12px] text-primary-foreground/80 text-center'>{numberOfComics} comics</p>
        </div>
      </Link>
    </div>
    </div>
  )
}
