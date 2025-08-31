"use client"
import React from 'react'
import ComicCard from './comic-card'
import NavigateBefore from '@/components/navigate-before'
import NavigateNext from '@/components/navigate-next'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetAllComics } from '../api/use-get-all-comics'
import { Loader } from 'lucide-react'

type Comic = {
    thumbnail: string | null;
    _id: Id<"comics">;
    title: string;
}
type ComicGridRowProps = {
    comics: Comic[]
}
//map for Comic type
export default function ComicGridRow() {
  const {data, isLoading} = useGetAllComics()
  if(isLoading) return <Loader/>
  if(!data) return <div>no data</div>
  return (
    <div className='flex gap-3 md:gap-8 items-center p-3'>
        <div className='hidden md:flex'>
        <NavigateBefore/>
        </div>
        <div className='flex flex-cols-2 lg:flex-cols-4 gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px] overflow-scroll md:overflow-hidden'>
            {data.map((comic) => (
                <ComicCard 
                key={comic._id}
                title={comic.title}
                views={230}
                thumbnail={comic.thumbnail}
                />
            ))}
            
        </div>
        <div className='hidden md:flex'>

        <NavigateNext/>
        </div>
    </div>
    
  )
}
