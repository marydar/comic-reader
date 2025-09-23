"use client"
import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/image.png"
import Link from 'next/link'
import { Id } from '../../../../convex/_generated/dataModel'
import { cn } from "@/lib/utils";
import { Edit, Heart, Trash2Icon } from 'lucide-react'
import { BiSolidHeartSquare } from 'react-icons/bi'
import { HiHeart } from 'react-icons/hi2'
import { MdRemove, MdRemoveCircle } from 'react-icons/md'
interface ChapterCardProps {
    _id: string;
    title: string;
    views: number;
    likes: number;
    order: number;
    isSeen: boolean;
    numberOfLikes: number;
    createdAt: number;
    thumbnail: string | null |undefined;
    comicId : Id<"comics">;
    userIsCreator: boolean;
    handleEditChapter: (chapterId: string) => void;
    handleDeleteChapter: (chapterId: string) => void;
}
export default function ChapterCard({_id, title, views, likes,order, createdAt, thumbnail, comicId, isSeen, numberOfLikes, userIsCreator, handleDeleteChapter, handleEditChapter}: ChapterCardProps) {
  return (
    <div className={cn('flex bg-background relative items-center justify-start min-w-[150px] max-w[150px] min-h-[50px] max-h-[50px]  md:w-full md:max-h-[70px] md:min-h-[70px]  border-1 border-primary rounded-2xl cursor-grab',isSeen && 'bg-bars/60 border-primary/60 border-1')}>
      <Link href={`/comic/${comicId}/ch_${order}`}>
      <div className='flex items-center justify-center w-full  gap-4 px-2 md:px-4 '>
        <img src={thumbnail ? thumbnail : undefined} alt={"comic1"} className='object-center   rounded-2xl  max-w-[30px] max-h-[30px] min-w-[30px] md:max-w-[40px] md:max-h-[40px] md:min-w-[40px]' width={50} height={50}/>
        {/* <Image src={myImage} alt={"comic1"} className='object-center   rounded-2xl ' width={50} height={50}/> */}
        <div className='flex flex-col justify-between w-[100px] md:w-[200px] gap-1'>
            <p className='text-[10px] md:text-[16px] text-foreground text-left truncate px-0'>{title}</p>
            <p className='text-[8px] md:text-[12px] text-foreground/80 text-left'>{new Date(createdAt).toLocaleDateString()} </p>
        </div> 
      </div>
      </Link>
        <div className='flex absolute right-5 gap-4 items-center justify-center'>
          {userIsCreator && (
            <div  className='flex gap-2 max-w-[50px]  '>
              <Edit onClick={()=>handleEditChapter(_id)} className='text-foreground/80 text-2xl hover:scale-125 hover:text-foreground cursor-pointer'/>
              <Trash2Icon onClick={()=>handleDeleteChapter(_id)} className='text-foreground/80 text-2xl hover:scale-125 hover:text-foreground cursor-pointer'/>
            </div>
          )}
          <div className='flex gap-2'>
          <p className='text-[8px] md:text-[12px] text-foreground/80 '>{numberOfLikes}</p>
          <HiHeart className='text-foreground/50 text-xl'/>
          </div>
        </div>
    </div>
  )
}
