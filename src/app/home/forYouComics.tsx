import React from 'react'
import ComicGridRow from '@/features/comic/components/comic-grid-row'

const ForYouComics = () => {
  return (
    <div className='md:px-[320px] py-1 md:py-8 flex flex-col w-full h-[300px] md:h-[600px] '>
        <p className='px-12 md:px-0 text-foreground text-l md:text-2xl text-left'>For you</p>
        <div className='p-1 md:p-4 flex justify-center'>
          <ComicGridRow/>
        </div>
    </div>
  )
}

export default ForYouComics