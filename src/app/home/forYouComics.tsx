"use client"
import React from 'react'
import ComicGridRow from '@/features/comic/components/comic-grid-row'
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Loader } from 'lucide-react'
import { Id } from '../../../convex/_generated/dataModel'
import { useEffect, useState } from 'react'
import ComicGridRowSkeleton from '@/features/comic/components/comic-grid-row-skeleton'



const ForYouComics = () => {
  const {data, isLoading} = useGetAllComics()

  const comics = (data ?? []).map((comic) => ({
    _id: comic._id,
    title: comic.title,
    thumbnail: comic.thumbnail,
    views: comic.views,
    description: comic.description,
    genres: comic.genres,
     // safe fallback
  }));

  return (
    <div className='flex justify-center w-full '>
    <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
        <p className='md:px-12 px-4  text-foreground text-l md:text-2xl text-left'>For you</p>
        <div className='p-1 md:p-4 flex justify-center'>
          {isLoading && <ComicGridRowSkeleton/>}
          {!isLoading && data && (
            <ComicGridRow comics={comics}/>
          )}
        </div>
    </div>
    </div>
  )
}

export default ForYouComics