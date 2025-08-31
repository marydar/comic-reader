"use client"
import React from 'react'
import ComicGridRow from '@/features/comic/components/comic-grid-row'
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Loader } from 'lucide-react'
import { Id } from '../../../convex/_generated/dataModel'
import { useEffect, useState } from 'react'

type Comic = {
    thumbnail: string | null;
    _id: Id<"comics">;
    title: string;
}
const ForYouComics = () => {
  // const {data, isLoading} = useGetAllComics()
  // if(isLoading) return <Loader/>
  // if(!data) return <div>no data</div>
  // const [Comics, setComics] = useState<Comic[]>([]);

  // useEffect(()=>{
  //   data.forEach((comic)=>{
  //     const newComic:Comic = {
  //       thumbnail: comic.thumbnail,
  //       _id: comic._id,
  //       title: comic.title,
  //     }
  //     setComics((prevComics)=>{
  //       return [...prevComics, newComic]
  //     })
  //   })
  // },[data])

  return (
    <div className='flex justify-center w-full '>
    <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
        <p className='md:px-12 px-4  text-foreground text-l md:text-2xl text-left'>For you</p>
        <div className='p-1 md:p-4 flex justify-center'>
          <ComicGridRow/>
        </div>
    </div>
    </div>
  )
}

export default ForYouComics