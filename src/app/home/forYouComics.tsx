import React from 'react'
import ComicGridRow from '@/features/comic/components/comic-grid-row'

const ForYouComics = () => {
  return (
    <div className='flex justify-center w-full '>
    <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
        <p className=' px-12  text-foreground text-l md:text-2xl text-left'>For you</p>
        <div className='p-1 md:p-4 flex justify-center'>
          <ComicGridRow/>
        </div>
    </div>
    </div>
  )
}

export default ForYouComics