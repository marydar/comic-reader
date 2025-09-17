import React from 'react'
import my_image from '../../../home/imgs/image.png'
import Image from 'next/image'
import { FaFileLines } from "react-icons/fa6";
import TopMenu from './top-menu';
import { cn } from "@/lib/utils";

interface Props {
    comicName: string;
    chapterName: string;
    handleGoToComic: () => void;
    autoScrollDown: () => void;
    showBar: boolean;
    
  
}
export default function TopBar({comicName, chapterName, handleGoToComic,autoScrollDown, showBar}: Props) {
  return (
    <div onClick={(e)=>{e.stopPropagation()}} className={cn('flex justify-center items-center w-full h-16  bg-bars/80 top-0 fixed backdrop-blur-sm z-50', !showBar && 'hidden')}>
        <div className='flex items-center justify-center w-full md:w-[1200px] h-full relative'>
            <div className='flex items-center justify-start gap-4  w-[800px] h-full  p-4 relative'>
                <div onClick={handleGoToComic} className='cursor-pointer'>
                <Image src={my_image} alt="" className='h-8 w-8 md:h-10 md:w-10 rounded-full object-cover' />
                </div>
                <div className='flex flex-col items-start justify-center'>
                    <p className='text-[16px] md:text-[20px] text-forground'>{comicName}</p>
                    <p className='text-[10px] md:text-[14px] text-foreground/80'>{chapterName}</p>
                </div>
                <div className='items-center justify-center absolute right-0 p-2 hidden md:flex'>
                    <FaFileLines className='text-bars-foreground text-[24px] cursor-pointer hover:scale-120 hover:text-foreground' />
                </div>
            </div>
            
            <div className='items-center justify-center absolute right-0 p-4 flex md:hidden'>
            <TopMenu autoScrollDown={autoScrollDown}/>
            </div>
        </div>
    </div>
  )
}
