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

// type Comic = typeof api.comics extends (infer T)[] ? T : never;

const PopularComics = () => {
    const {data, isLoading} = useGetAllComics()
    if(isLoading) return <Loader/>
    if(!data) return <div>no data</div>
    // const [selectedIndex, setSelectedIndex] = useState(0)

    const handleBefore = () => {
        // if (data &&  data.length > 0){
        //     setSelectedIndex((prevIndex) => {
        //     const newIndex = prevIndex > 0 ? prevIndex - 1 : data.length - 1;
        //     return newIndex;
        //     });
        // }
    };


        

  return (
    <div className='lg:p-10 p-4 md:pt-6 flex w-full h-[200px] md:h-[400px]  lg:h-[700px] text-foreground text-center cursor-grab'>
        <div className='bg-blue-950 w-full relative rounded-3xl'>
            <img src={data[1].header? data[1].header : undefined} alt={"comic1"} className='w-full object-fill  h-full rounded-4xl'/>
            <div className='w-full h-[50px] md:h-[100px]  absolute bottom-1 flex justify-between items-center px-8 md:px-12 py-4'>
                <div className=' w-[100px] h-[20px] md:w-[500px] md:h-[60px] bg-primary/40 rounded-4xl text-primary text-left text-[10px] md:text-[22px] truncate  px-2 md:px-8 flex  items-center'>
                    {data[1].title}
                </div>
                <div className='flex gap-2 items-center justify-center'>
                    <div onClick={()=>handleBefore()}>
                    <NavigateBefore/>
                    </div>
                    <div>
                    <NavigateNext/>
                    </div>
                </div>
            </div>
        </div>
        {/* Popular Comics */}
    </div>
  )
}

export default PopularComics