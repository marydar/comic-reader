import React from 'react'
import ComicCard from './comic-card'
import NavigateBefore from '@/components/navigate-before'
import NavigateNext from '@/components/navigate-next'

export default function ComicGridRow() {
  return (
    <div className='flex gap-3 md:gap-8 items-center p-3'>
        <NavigateBefore/>
        <div className='flex flex-cols-2 lg:flex-cols-4 gap-2 md:gap-8 w-[250px] md:w-[600px] lg:w-[1100px] overflow-hidden'>
            {Array.from({length: 6}, (_, i) => i + 1).map((item) => (
                <ComicCard key={item}/>
            ))}
        </div>
        <NavigateNext/>
    </div>
    
  )
}
