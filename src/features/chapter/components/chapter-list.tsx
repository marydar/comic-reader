import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import ChapterCard from './chapterCard'
import {  PlusCircle } from 'lucide-react';
import { HiArrowsUpDown } from 'react-icons/hi2';
import { Loader } from 'lucide-react';
import { cn } from "@/lib/utils";
import { BiUpArrowCircle } from 'react-icons/bi';
type Chapter = {
  _id: Id<"chapters">;
  title: string;
  thumbnail: string | null | undefined;
  createdAt: number;
  likes : number;
  views: number;
  order: number;
  isSeen: boolean;
  numberOfLikes: number;
  
}

interface ChapterListProps {
    chapters: Chapter[];
    numberOfChapters: number | undefined;
    handleAddNewChapter: () => void;
    userIsCreator: boolean;
    sortOption: "desc" | "asc";
    setSortOption: (sortOpetion: "desc" | "asc") => void;
    loadMore:()=>void
    isLoadingMore?:boolean
    canLoadMore?:boolean
    comicId: Id<"comics">;
    isModal?:boolean
}


export default function ChapterList({chapters, numberOfChapters, handleAddNewChapter, userIsCreator, sortOption, setSortOption, loadMore, isLoadingMore, canLoadMore, comicId, isModal}: ChapterListProps) {
    const toggleSortOption = () => {
      if(sortOption === "desc"){
        setSortOption("asc")
      }
      else{
        setSortOption("desc")
      }
    }
    return (
    <div className={cn('flex flex-col  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary border-1 my-4 md:my-10 max-h-[500px] md:max-h-[800px] ', isModal && 'w-[290px] md:w-[200px] lg:w-[450px] max-h-[500px] md:max-h-[500px] my-2 md:my-4')}>
            <div className=' bg-primary/40 rounded-t-2xl text-center text-[12px] md:text-[18px] text-foreground p-4 md:p-4 flex justify-between items-center '>
            <div className='px-4'>
                <p>Chapters</p>
                <p className='text-[10px] md:text-[12px] text-foreground/70 text-left'>{numberOfChapters ?? 0}</p>
            </div>  

            <div className='px-4' onClick={toggleSortOption}>
                {sortOption === "desc" && <BiUpArrowCircle className='text-foreground text-2xl cursor-pointer'/>}
                {sortOption === "asc" && <BiUpArrowCircle className='text-foreground text-2xl rotate-180 cursor-pointer'/>} 
            </div>
            </div>
            {userIsCreator && (
              <div onClick={handleAddNewChapter} className='flex justify-start items-center w-full gap-4 p-4 cursor-pointer hover:bg-primary/10'>
                <PlusCircle className='text-primary text-2xl '/>
                Add new chapter
              </div>
            )}
            <div className='grid grid-cols-1 gap-4 mt-4 justify-center items-center px-4 overflow-y-scroll scollbar'>
              {(numberOfChapters === 0 || numberOfChapters === undefined) && <p className='text-[12px] md:text-[14px] text-foreground/70 p-4 text-center'>no chapters available</p>}
              {chapters.map((chapter) => (
                
                <ChapterCard key={chapter._id} _id={chapter._id} title={chapter.title} views={230} likes={230} order={chapter.order} createdAt={chapter.createdAt} thumbnail={chapter.thumbnail} comicId={comicId} isSeen={chapter.isSeen} numberOfLikes={chapter.numberOfLikes}/>
              ))}
               
               <div
                className="h-1"
                ref={(el) =>{
                    if(el){
                        const observer = new IntersectionObserver(
                            ([entry])=>{
                                if(entry.isIntersecting && canLoadMore){
                                    loadMore()
                                }
                            },
                            {threshold: 1.0}
                        )
                        observer.observe(el)
                        return () => {observer.disconnect()}
                    }
                }}
            />
            {isLoadingMore && (
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                    <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gary-300 shadow-sm">
                        <Loader className="size-4 animate-spin"/>
                    </span>
                </div>
            )}
            </div>
        </div>
  )
}
