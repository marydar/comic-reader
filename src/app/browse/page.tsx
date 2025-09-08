"use client"
import ComicList from '@/features/comic/components/comic-list'
import React from 'react'
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Loader } from 'lucide-react'
import { useState } from 'react'

const BrowsePage = () => {
    const {data, isLoading} = useGetAllComics()
    const [selectedSort, setSelectedSort] = useState<string>("views");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    if(isLoading) return <Loader/>
    if(!data) return <div>no data</div>

    const comics = (data ?? []).map((comic) => ({
        _id: comic._id,
        title: comic.title,
        thumbnail: comic.thumbnail, // safe fallback
    }));
    const handleFilter = () => {
        console.log("filter clicked");
        console.log("selected sort is " + selectedSort);
        console.log("selected genres are " + selectedGenres);
    };
  return (
    <div className='flex justify-center items-center w-full'>
        <ComicList comics={comics} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} selectedSort={selectedSort} setSelectedSort={setSelectedSort} handleFilter={handleFilter}/>
    </div>
  )
}

export default BrowsePage