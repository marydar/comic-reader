"use client"
import ComicList from '@/features/comic/components/comic-list'
import React, { use } from 'react'
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Loader, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useGetComics } from '@/features/comic/api/use-get-comics'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { genreEnum } from '../../../convex/genres'
import { genres } from '@/components/genres'
export type Genre = typeof genreEnum.type;
const genreEnumValues = genreEnum.type;
import { useCurrentUser } from '@/features/auth/api/use-current-user'
import ComicListSkeleton from '@/features/comic/components/comic-list-skeleton'

const BrowsePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
    const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
    const selectedSort = searchParams.get("sort") ?? "views" ;
    const searchValue = searchParams.get("searchValue") ?? "" ;
    const selectedGenres = searchParams.get("genres")?.split(",") ?? [];
    const pageSize = 2;
    const invalidGenre = selectedGenres.some((genre) => !genres.includes(genre));
    const invalidSort = selectedSort !== "views" && selectedSort !== "date" && selectedSort !== "subscriptions" && selectedSort !== "names";
    if(invalidGenre  || isNaN(currentPage)){
      return (
        <div className='flex justify-center items-center w-full h-[80vh]'>
          <div className='flex flex-col justify-center items-center'>
          <TriangleAlert className='text-foreground text-4xl'/>
          page not found 
        </div>
        </div>
        
      )
    }
    
    const {data: paginatedData, isLoading} = useGetComics({
        page: currentPage,
        pageSize: pageSize,
        searchedName: searchValue,
        genres: selectedGenres as Genre[] ?? [],
        sortBy: selectedSort as "views" | "date" | "subscriptions" | "names" ?? "views",
    });
    // if(isLoading) return <Loader/>
    // if(!paginatedData?.comics) return <div>no data</div>
    const invalid = paginatedData && paginatedData.totalPages < currentPage
    const invalidPage = currentPage < 1 || invalid;

    if(invalidPage && paginatedData?.comics.length !== 0){
      return (
        <div className='flex justify-center items-center w-full h-[80vh]'>
          <div className='flex flex-col justify-center items-center'>
          <TriangleAlert className='text-foreground text-4xl'/>
          page not found  invalid page
        </div>
        </div>
        
      )
    }

    const comics = (paginatedData?.comics ?? []).map((comic) => ({
        _id: comic._id,
        title: comic.title,
        thumbnail: comic.thumbnail,
        views: comic.views,
        description: comic.description,
        genres: comic.genres,
         // safe fallback
    }));
     const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`/browse?${params.toString()}`);
    };
    const handleFilter = (genres: string[], sort: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1"); // reset page on filter
      params.set("sort",sort );
      if(genres.length === 0){
        params.delete("genres");
      }
      else{
        
        params.set("genres", genres.join(","));
      }
      router.push(`/browse?${params.toString()}`);
      
    };
    const handleSearch = (search: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString()); // reset page on filter
      params.set("searchValue",search );
      router.push(`/browse?${params.toString()}`);
      
    };

  return (
    <div className='flex justify-center items-center w-full'>
      {isLoading && <ComicListSkeleton/>}
      {!isLoading && comics.length === 0 && (
        <div className='flex justify-center items-center w-full h-[80vh]'>
          <div className='flex flex-col justify-center items-center'>
          <TriangleAlert className='text-foreground text-4xl'/>
          no comics found
        </div>
        </div>
      )}
      {!isLoading && paginatedData && comics.length !== 0 && (
        <ComicList
         comics={comics}
         totalPages={paginatedData.totalPages}
         selectedGenres={selectedGenres}
         selectedSort={selectedSort}
         currentPage={currentPage}
         searchValue={searchValue}
         handleSearch={handleSearch}
         handleFilter={handleFilter}
         handlePageChange={handlePageChange}
         />
        )}
    </div>
  )
}

export default BrowsePage