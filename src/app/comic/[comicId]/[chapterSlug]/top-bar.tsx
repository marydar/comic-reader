import React, { useState } from 'react'
import my_image from '../../../home/imgs/image.png'
import Image from 'next/image'
import { FaFileLines } from "react-icons/fa6";
import TopMenu from './top-menu';
import { cn } from "@/lib/utils";
import AutoScroll from './auto-scroll';

interface Props {
    comicName: string;
    chapterName: string;
    thumnailUrl: string |null;
    handleGoToComic: () => void;
    // autoScrollDown: () => void;
    isLiked: boolean | null;
    toggleLike: () => void;
    showBar: boolean;
    
  
}
export default function TopBar({comicName, chapterName,thumnailUrl, handleGoToComic, showBar, isLiked, toggleLike}: Props) {
    const [autoScroll, setAutoScroll] = useState(false);
            const autoScrollDown = () => {
                setAutoScroll(!autoScroll)
            }
  return (
    <div onClick={(e)=>{e.stopPropagation()}} className={cn('flex justify-center items-center w-full h-16  bg-bars/80 top-0 fixed backdrop-blur-sm z-50', !showBar && 'hidden')}>
        <div className='flex items-center justify-center w-full md:w-[1200px] h-full relative'>
            <AutoScroll show={autoScroll}/>
            <div className='flex items-center justify-start gap-4  w-[800px] h-full  p-4 relative'>
                <div onClick={handleGoToComic} className='cursor-pointer'>
                <img src={thumnailUrl ? thumnailUrl : undefined} alt="" className='w-[40px] h-[40px] rounded-full' />
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
            <TopMenu autoScrollDown={autoScrollDown}   isLiked={isLiked} toggleLike={toggleLike}/>
            </div>
        </div>
    </div>
  )
}
