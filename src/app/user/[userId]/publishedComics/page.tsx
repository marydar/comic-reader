"use client"
import ComicList from '@/features/comic/components/comic-list'
import React, { use } from 'react'
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Loader, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useGetComics } from '@/features/comic/api/use-get-comics'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { genreEnum } from '../../../../../convex/genres'
import { genres } from '@/components/genres'
import {useUserId} from '@/hooks/use-user-id'
export type Genre = typeof genreEnum.type;
const genreEnumValues = genreEnum.type;
import { Id } from '../../../../../convex/_generated/dataModel'
import { useCurrentUser } from '@/features/auth/api/use-current-user'

const PublishedComicsPage = () => {
  const searchParams = useSearchParams();
  const userId = useUserId();
  const router = useRouter();
    const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
    const selectedSort = searchParams.get("sort") ?? "views" ;
    const searchValue = searchParams.get("searchValue") ?? "" ;
    const selectedGenres = searchParams.get("genres")?.split(",") ?? [];
    const pageSize = 2;
    const invalidGenre = selectedGenres.some((genre) => !genres.includes(genre));
    const invalidSort = selectedSort !== "views" && selectedSort !== "date" && selectedSort !== "subscriptions" && selectedSort !== "names";
    const invalidPlaylistId = userId === "" || userId === undefined;
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
    console.log("userId", userId)
    
    const {data: paginatedData, isLoading} = useGetComics({
        page: currentPage,
        pageSize: pageSize,
        searchedName: searchValue,
        genres: selectedGenres as Genre[] ?? [],
        sortBy: selectedSort as "views" | "date" | "subscriptions" | "names" ?? "views",
        creatorId: userId as Id<"users">,
    });
    if(isLoading) return <Loader/>
    if(!paginatedData?.comics) return <div>no data</div>
    const invalidPage = currentPage < 1 || currentPage > paginatedData.totalPages;
    if(paginatedData.comics.length === 0){
      
      
      // router.push(`/browse?`);
    }

    if(invalidPage && paginatedData.comics.length !== 0){
      return (
        <div className='flex justify-center items-center w-full h-[80vh]'>
          <div className='flex flex-col justify-center items-center'>
          <TriangleAlert className='text-foreground text-4xl'/>
          page not found  invalid page
        </div>
        </div>
        
      )
    }

    const comics = (paginatedData.comics ?? []).map((comic) => ({
        _id: comic._id,
        title: comic.title,
        thumbnail: comic.thumbnail, // safe fallback
    }));
     const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`/user/${userId}/publishedComics?${params.toString()}`);
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
      router.push(`/user/${userId}/publishedComics?${params.toString()}`);
      
    };
    const handleSearch = (search: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString()); // reset page on filter
      params.set("searchValue",search );
      router.push(`/user/${userId}/publishedComics?${params.toString()}`);
      
    };

  return (
    <div className='flex justify-center items-center w-full'>
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
    </div>
  )
}

export default PublishedComicsPage