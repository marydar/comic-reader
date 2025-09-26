"use client"
import React from 'react'
import Image from 'next/image'
import myImage from "@/app/home/imgs/orv.jpg"
import NavigateNext from "@/components/navigate-next"
import NavigateBefore from "@/components/navigate-before"
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { api } from "../../../convex/_generated/api";
import { Id } from '../../../convex/_generated/dataModel'
import Link from 'next/link'
import HeroSkeleton from './hero-skeleton'


const PopularComics = () => {
    const {data, isLoading} = useGetAllComics()
    const [startIndex, setStartIndex] = useState(0);
    const comics = (data ?? []).map((comic) => ({
    id: comic._id,
    title: comic.title,
    header: comic.header ,
  }));
    const handleNext = () => {
    
    setStartIndex((prev) => (prev +1) % comics.length);// loops back to start
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + comics.length) % comics.length); // loops to end
  };
 const chanegedOrderComics = [
    ...comics.slice(startIndex), // from startIndex → end
    ...comics.slice(0, startIndex), // from 0 → startIndex-1
  ];

        

  return (
    <div className='lg:p-10 p-4 md:pt-6 flex w-full h-[200px] md:h-[400px]  lg:h-[700px] text-foreground text-center cursor-grab'>
        {(isLoading || data?.length === 0) && <HeroSkeleton/>}
        {!isLoading && data && (
          <div className='flex overflow-x-scroll gap-4 p-3 scrollbar'>
            {
              chanegedOrderComics.map((comic, index) => (
                <div key={comic?.id} className='bg-blue-950  relative rounded-3xl md:max-w-[1800px] md:min-w-[1800px] max-w-[320px] min-w-[320px]'>
                    <Link href={`/comic/${comic?.id}`}>
                    <img src={comic?.header ? comic?.header : undefined} alt={"comic1"} className='w-full h-full  object-cover  rounded-3xl'/>
                    </Link>
                    <div className='w-full h-[50px] md:h-[100px]  absolute bottom-1 flex justify-between items-center px-8 md:px-12 py-4'>
                        <div className=' min-w-[100px] h-[20px] md:min-w-[500px] md:h-[60px] bg-primary/50 rounded-4xl text-foreground/90 text-left text-[8px] md:text-[22px] truncate  px-2 md:px-8 flex  items-center'>
                            {comic?.title}
                        </div>
                        <div className='flex gap-2 items-center justify-center'>
                            <div onClick={()=>handlePrev()}>
                            <NavigateBefore variant="header"/>
                            </div>
                            <div onClick={()=>handleNext()}>
                            <NavigateNext variant="header"/>
                            </div>
                        </div>
                    </div>
                </div>
              ))
            }

          </div>
        )}
        {/* Popular Comics */}
    </div>
  )
}

export default PopularComics