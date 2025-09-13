"use client"
import React from 'react'
import PlaylistCard from './playlist-card'
import NavigateBefore from '@/components/navigate-before'
import NavigateNext from '@/components/navigate-next'
import { Id } from '../../../../convex/_generated/dataModel'
// import { useGetAllComics } from '../api/use-get-all-comics'
import { Loader, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

type PlaylistInformation = {
  _id: Id<"playlists">;
  title: string;
  numberOfComics: number;
  thumbnail: string | null;
//   genres: string[];
};
interface PlaylistGridRowProps {
  playlists: PlaylistInformation[];
}

//map for Comic type
export default function PlaylistGridRow({ playlists }: PlaylistGridRowProps) {
    const [startIndex, setStartIndex] = useState(0);
    if(!playlists) return (
        <div className='flex justify-center flex-col items-center'>
        <TriangleAlert/>
        <p>No playLists found</p>
        </div>
    )
    if(playlists.length === 0) return (
        <div className='flex justify-center flex-col items-center text-primary pt-8'>
        <TriangleAlert/>
        <p>This comic is not in any playlists yet</p>
        </div>
    )
    const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % playlists.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + playlists.length) % playlists.length);
  };
  const chanegedOrderPlaylists = [
    ...playlists.slice(startIndex), // from startIndex → end
    ...playlists.slice(0, startIndex), // from 0 → startIndex-1
  ];
  return (
    <div className='flex gap-3 md:gap-8 items-center p-3'>
        <div className='hidden md:flex' onClick={()=>handlePrev()}>
        <NavigateBefore/>
        </div>
        <div className='flex  gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px] overflow-scroll scrollbar '>
            {chanegedOrderPlaylists?.map((pl, index) => (
                
                <PlaylistCard 
                key={pl._id}
                _id={pl._id}
                title={pl.title}
                numberOfComics={pl.numberOfComics}
                thumbnail={pl.thumbnail}
                />
                
            ))}
            
        </div>
        <div className='hidden md:flex' onClick={()=>handleNext()}>
        <NavigateNext/>
        </div>
    </div>
    
  )
}
