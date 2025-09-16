"use client"
import React from 'react'
import ComicCard from './comic-card'
import NavigateBefore from '@/components/navigate-before'
import NavigateNext from '@/components/navigate-next'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetAllComics } from '../api/use-get-all-comics'
import { Loader, TriangleAlert } from 'lucide-react'
import { useState } from 'react'


//map for Comic type
export default function ComicGridRowSkeleton() {
  return (
    <div className='flex gap-3 md:gap-8 items-center p-3'>
        <div className='hidden md:flex' >
        <NavigateBefore/>
        </div>
        <div className='flex  gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px] overflow-scroll scrollbar '>
            {Array(4).fill(0).map((_, index) => (
                <div key={index} className='min-w-[150px] max-w[150px] h-[240px] md:min-w-[250px] md:max-w-[250px] md:h-[400px] bg-primary/40 rounded-2xl cursor-grab'>
                </div>
            ))}
        </div>
        <div className='hidden md:flex' >
        <NavigateNext/>
        </div>
    </div>
    
  )
}
