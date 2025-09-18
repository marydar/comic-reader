import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/thumbnail.webp"
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
interface ComicCardProps {
    _id: string;
    title: string;
    views: number;
    thumbnail: string | null;
}
export default function ComicCard({_id,title, views, thumbnail}: ComicCardProps) {
  return (
    <>
        <div className='min-w-[150px] max-w[150px] h-[240px] md:min-w-[250px] md:max-w-[250px] md:h-[400px] bg-primary rounded-2xl cursor-grab'>
          <Link href={`/comic/${_id}`}>
            <img src={thumbnail? thumbnail: undefined} alt={"comic1"} className='w-full  object-cover h-[200px] md:h-[320px] rounded-t-2xl rounded-b-0'/>
            <Tooltip>
              <TooltipTrigger asChild>
                  <div className='flex flex-col justify-between w-full p-1 px-4 md:p-4 md:px-8 gap-0'>
                      <p className='text-[10px] md:text-[18px] text-primary-foreground text-center truncate px-0 md:px-2'>{title}</p>
                      <p className='text-[8px] md:text-[12px] text-primary-foreground/80 text-center'>{views} views</p>
                  </div>
              </TooltipTrigger>
              <TooltipContent className='bg-bars/40 backdrop-blur-lg rounded-2xl min-w-[120px] max-w[120px]  md:min-w-[220px] md:max-w-[220px] h-[180px] md:h-[300px]'>
                <div className='flex flex-col gap-2 p-4 md:p-8  '>
                  <p className='text-[12px] md:text-[14px] text-foreground'>{title}</p>
                  <p className='text-[8px] md:text-[12px] text-foreground/70 text-center'>{views} views</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </Link>
        </div>
    </>
      
  )
}
