"use client" 
import React from 'react'
import ComicGridRow from '@/features/comic/components/comic-grid-row'
import GenreButton from '@/components/genre-button'
import { genres } from '@/components/genres'
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { genreEnum } from '../../../convex/genres'
import { useGetPoplularComicsByGenre } from '@/features/comic/api/use-get-popular-comics-by-genre'
import ComicGridRowSkeleton from '@/features/comic/components/comic-grid-row-skeleton'
type Genre = typeof genreEnum.type;

const popularByCategory = () => {
  // const {data, isLoading} = useGetAllComics()
  const [selectedGenre, setSelectedGenre] = useState<string>("Horror");
  const {data, isLoading} = useGetPoplularComicsByGenre({genre: selectedGenre as Genre});

  const comics = (data ?? []).map((comic) => ({
    _id: comic._id,
    title: comic.title,
    thumbnail: comic.thumbnail,
    // genres: comic.,
     // safe fallback
  }));
  
  const handleGenreClick = (genre: string) => {
      setSelectedGenre((prev) => (genre)); 
      // 👆 click again to reset (toggle off)
    };
  return (

    <div className='flex justify-center w-full '>
        <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
            <p className=' md:px-12 px-4  text-foreground text-l md:text-2xl text-left'>Popular by category</p>
            <div className=' md:px-[50px]  px-4  grid  grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2 my-4'>
                {genres.map((genre) => (
                    (
                    <div key={genre} onClick={()=>handleGenreClick(genre)} className='cursor-pointer'>
                      <GenreButton key={genre} variant={selectedGenre === genre ? 'active' : 'not-active'} genre={genre}/>
                    </div>
                    )
                ))}
             </div>
             <div className='p-1 md:p-4 flex justify-center'>
              {isLoading && <ComicGridRowSkeleton/>}
                {!isLoading && data && (
                    <ComicGridRow comics={comics}/>
                )}  
            </div>
        </div>
    </div>

  )
}

export default popularByCategory