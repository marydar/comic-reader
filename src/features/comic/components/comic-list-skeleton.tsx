"use client"
import React, { use } from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { ChevronDown, TriangleAlert } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { get } from 'http';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import GenreSelector from '@/components/genre-selector';
import ComicCard from './comic-card';
import GenreButton from '@/components/genre-button';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import { useEffect } from 'react';
import { Search } from "lucide-react"
import { Input } from '@/components/ui/input';


export default function ComicListSkeleton() {
    
  return (
    <div className='flex justify-center w-full'>
      <div className='flex flex-col w-full items-center justify-center rounded-2xl  my-4 md:my-10'>
        <div className='flex flex-col gap-4'>
            <div className='flex w-full items-center gap-4 pt-4 cursor-pointer  h-[50px] bg-primary/40 rounded-2xl py-8' />
            <div className='flex w-full items-center gap-4 pt-4 cursor-pointer  h-[50px] bg-primary/40 rounded-2xl py-8' />
            <div className='flex w-full flex-col gap-4 py-4  justify-center items-center'>
                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px]'>
                        {Array(8).fill(0).map((_, index) => (
                        <div key={index} className='min-w-[150px] max-w[150px] h-[240px] md:min-w-[250px] md:max-w-[250px] md:h-[400px] bg-primary/40 rounded-2xl cursor-grab'>
                        </div>
                    ))}     
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
