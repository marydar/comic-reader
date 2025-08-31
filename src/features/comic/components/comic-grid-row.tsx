import React from 'react'
import ComicCard from './comic-card'
import NavigateBefore from '@/components/navigate-before'
import NavigateNext from '@/components/navigate-next'

export default function ComicGridRow() {
  return (
    <div className='flex gap-3 md:gap-8 items-center p-3'>
        <div className='hidden md:flex'>
        <NavigateBefore/>
        </div>
        <div className='flex flex-cols-2 lg:flex-cols-4 gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px] overflow-scroll md:overflow-hidden'>
            {Array.from({length: 6}, (_, i) => i + 1).map((item) => (
                <ComicCard key={item}/>
            ))}
        </div>
        <div className='hidden md:flex'>

        <NavigateNext/>
        </div>
    </div>
    
  )
}
