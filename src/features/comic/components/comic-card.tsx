import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/thumbnail.webp"
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import GenreButton from '@/components/genre-button'
interface ComicCardProps {
    _id: string;
    title: string;
    views: number;
    thumbnail: string | null;
    genres: string[];
    description: string;
}
//p-1 px-4 md:p-4 md:px-8 gap-0
//px-0 md:px-2
export default function ComicCard({_id,title, views, thumbnail, genres, description}: ComicCardProps) {
  return (
    <>
        <div className='min-w-[150px] max-w[150px] h-[240px] md:min-w-[250px] md:max-w-[250px] md:h-[400px] bg-primary rounded-2xl cursor-grab'>
          <Link href={`/comic/${_id}`}>
            <img src={thumbnail? thumbnail: undefined} alt={"comic1"} className='w-full  object-cover h-[200px] md:h-[320px] rounded-t-2xl rounded-b-0'/>
            <Tooltip>
              <TooltipTrigger asChild>
                  <div className='flex  justify-center items-center w-full h-[40px] md:h-[80px] px-4 md:px-8'>
                    <div className='flex flex-col  justify-center  w-full'>
                      <p className='text-[10px] md:text-[16px] text-primary-foreground text-center truncate '>{title}</p>
                      <p className='text-[8px] md:text-[12px] text-primary-foreground/80 text-center'>{views} views</p>
                    </div>
                  </div>
              </TooltipTrigger>
              <TooltipContent className='bg-bars/40 backdrop-blur-lg rounded-2xl min-w-[120px] max-w[120px]  md:min-w-[220px] md:max-w-[220px] h-[180px] md:h-[300px]'>
                <div className='flex flex-col gap-2 p-2  '>
                  <p className='text-[12px] md:text-[14px] text-foreground text-center truncate'>{title}</p>
                  <div className=' grid  grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 my-4 max-h-[80px] overflow-hidden'>
                      {genres?.map((genre : string) => (
                      <GenreButton key={genre} genre={genre} variant='show'/>
                      ))}

                  </div>
                  <p className='text-[8px] md:text-[12px] text-foreground/70 text-left max-h-[110px] overflow-hidden '>{description}</p>
                  
                </div>
              </TooltipContent>
            </Tooltip>
          </Link>
        </div>
    </>
      
  )
}
