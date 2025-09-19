import React from 'react'
import my_image from '../../../home/imgs/image.png'
import Image from 'next/image'
import { FaComment, FaFileLines } from "react-icons/fa6";
import { Heart, HeartMinus, HeartMinusIcon, HeartPlus } from 'lucide-react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import {GrCaretNext} from 'react-icons/gr';
import { FaBars, FaCommentAlt } from 'react-icons/fa';
import { GoZoomIn } from 'react-icons/go';
import { BiMouse } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa6';
import { cn } from "@/lib/utils";
import { HiHeart } from 'react-icons/hi2';
import AutoScroll from './auto-scroll';
import { useState } from 'react';
import AutoScrollMD from './auto-scroll-md';
interface Props {
    handleNextChapter: () => void;
    handlePrevChapter: () => void;
    // autoScrollDown: () => void;
    setShowChapterListModal: (show: boolean) => void;
    isLiked: boolean | null;
    toggleLike: () => void;
    showBar: boolean;
}

export default function BottomBar({handleNextChapter, handlePrevChapter, showBar, setShowChapterListModal, isLiked, toggleLike}: Props) {
    const [autoScroll, setAutoScroll] = useState(false);
    const autoScrollDown = () => {
    setAutoScroll(!autoScroll)
    
  }
  return (
    <div onClick={(e)=>{e.stopPropagation()}} className={cn('justify-center items-center w-full h-16  bg-bars/80 bottom-0 fixed backdrop-blur-sm z-50 flex', !showBar && 'hidden')}>
        <div className='flex items-center justify-center w-full md:w-[1200px] h-full'>

           

            <div className='flex items-center justify-center gap-8 w-full  md:w-[800px] h-full  p-4 relative'>

                 <div className='items-center justify-center absolute left-0 p-4 hidden md:flex'>
                    <div className='flex justify-center items-center gap-8'>
                        {isLiked ? (
                            <HiHeart onClick={toggleLike} className='text-bars-foreground text-3xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />

                        ):
                        (
                            <Heart onClick={toggleLike} className='text-bars-foreground text-2xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                        )
                        }
                        <FaRegComment className='text-bars-foreground text-2xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                    </div>
                </div>


                {/* <MdNavigateBefore className='text-primary text-4xl cursor-pointer' /> */}
                <GrCaretNext  onClick={handlePrevChapter} className='text-bars-foreground text-xl md:text-3xl cursor-pointer rotate-180 hover:scale-120 hover:text-foreground' />
                <FaBars onClick={() => setShowChapterListModal(true)} className='text-bars-foreground text-2xl md:text-4xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                {/* <MdNavigateNext className='text-primary text-4xl text-center cursor-pointer' /> */}
                <GrCaretNext  onClick={handleNextChapter} className='text-bars-foreground text-xl md:text-3xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />


                <div className='items-center justify-center absolute right-0 p-4 hidden md:flex'>
                <div className='flex justify-center items-center gap-8'>
                    <GoZoomIn className='text-bars-foreground text-2xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                    <BiMouse className='text-bars-foreground text-2xl text-center cursor-pointer hover:scale-120 hover:text-foreground' onClick={autoScrollDown}/>
                    <AutoScrollMD show={autoScroll}/>
                </div>      
                </div>

            </div>

             
            
        </div>
    </div>
  )
}
