import React from 'react'
import ComicGridRow from '@/features/comic/components/comic-grid-row'
import GenreButton from '@/components/genre-button'
import { genres } from '@/components/genres'

const popularByCategory = () => {
  return (

    <div className='flex justify-center w-full '>
        <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
            <p className=' md:px-12 px-4  text-foreground text-l md:text-2xl text-left'>Popular by category</p>
            <div className=' md:px-[50px]  px-4  grid  grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2 my-4'>
                <GenreButton  variant="active" genre={genres[0]}/>
                {genres.map((genre) => (
                    genre !== genres[0] && <GenreButton key={genre} variant="not-active" genre={genre}/>
                ))}
             </div>
            <div className='p-1 md:p-4 flex justify-center'>
              <ComicGridRow/>
            </div>
        </div>
    </div>

  )
}

export default popularByCategory