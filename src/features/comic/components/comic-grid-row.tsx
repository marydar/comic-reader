"use client"
import React from 'react'
import ComicCard from './comic-card'
import NavigateBefore from '@/components/navigate-before'
import NavigateNext from '@/components/navigate-next'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetAllComics } from '../api/use-get-all-comics'
import { Loader, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

type Comic = {
  _id: Id<"comics">;
  title: string;
  thumbnail: string | null;
//   genres: string[];
};
interface ComicGridRowProps {
  comics: Comic[];
}
//map for Comic type
export default function ComicGridRow({ comics }: ComicGridRowProps) {
    const [startIndex, setStartIndex] = useState(0);
    if(!comics) return (
        <div className='flex justify-center flex-col items-center'>
        <TriangleAlert/>
        <p>No comics found</p>
        </div>
    )
    const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % comics.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + comics.length) % comics.length);
  };
  const chanegedOrderComics = [
    ...comics.slice(startIndex), // from startIndex → end
    ...comics.slice(0, startIndex), // from 0 → startIndex-1
  ];
  return (
    <div className='flex gap-3 md:gap-8 items-center p-3'>
        <div className='hidden md:flex' onClick={()=>handlePrev()}>
        <NavigateBefore/>
        </div>
        <div className='flex  gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px] overflow-scroll md:overflow-hidden'>
            {chanegedOrderComics?.map((comic, index) => (
                
                <ComicCard 
                key={comic._id}
                _id={comic._id}
                title={comic.title}
                views={230}
                thumbnail={comic.thumbnail}
                />
                
            ))}
            
        </div>
        <div className='hidden md:flex' onClick={()=>handleNext()}>

        <NavigateNext/>
        </div>
    </div>
    
  )
}
