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
import {useComicId} from '@/hooks/use-comic-id'
import { Id } from '../../../../../convex/_generated/dataModel'
export type Genre = typeof genreEnum.type;
const genreEnumValues = genreEnum.type;

import { useCurrentUser } from '@/features/auth/api/use-current-user'
import PlaylistList from '@/features/playlist/components/playlist-list'
import { useGetPlaylistsPagination } from '@/features/playlist/api/use-get-playlists-pagination'

const ComicPlaylistsPage = () => {
  const searchParams = useSearchParams();
  const comicId = useComicId();
  const router = useRouter();
    const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
    const selectedSort = searchParams.get("sort") ?? "saves" ;
    const searchValue = searchParams.get("searchValue") ?? "" ;
    const pageSize = 2;
    const invalidSort = selectedSort !== "numberOfComics" && selectedSort !== "date" && selectedSort !== "saves" && selectedSort !== "names";
    // if(invalidSort || isNaN(currentPage) || !comicId){
    //   return (
    //     <div className='flex justify-center items-center w-full h-[80vh]'>
    //       <div className='flex flex-col justify-center items-center'>
    //       <TriangleAlert className='text-foreground text-4xl'/>
    //       {comicId ? "page not found"+comicId : "page not found"}
    //       {/* page not found  */}
    //     </div>
    //     </div>
        
    //   )
    // }
    
    const {data: paginatedData, isLoading} = useGetPlaylistsPagination({
        page: currentPage,
        pageSize: pageSize,
        searchedName: searchValue,
        sortBy: selectedSort as "numberOfComics" | "date" | "saves" | "names" ?? "saves",
        comicId: comicId as Id<"comics">,
    });
    if(isLoading) return <Loader/>
    if(!paginatedData?.playlistsInfo) return <div>no data</div>
    const invalidPage = currentPage < 1 || currentPage > paginatedData.totalPages;

    if(invalidPage && paginatedData.playlistsInfo.length !== 0){
      return (
        <div className='flex justify-center items-center w-full h-[80vh]'>
          <div className='flex flex-col justify-center items-center'>
          <TriangleAlert className='text-foreground text-4xl'/>
          page not found 
        </div>
        </div>
        
      )
    }

    const playlists = (paginatedData.playlistsInfo ?? []).map((pl) => ({
        _id: pl.playlist._id,
        title: pl.playlist.name,
        numberOfComics: pl.numberOfComics,
        thumbnail: pl.lastComicThumbnail, // safe fallback
    }));
     const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`/comic/${comicId}/comicLists?${params.toString()}`);
    };
    const handleFilter = (sort: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString()); // reset page on filter
      params.set("sort",sort );
      router.push(`/comic/${comicId}/comicLists?${params.toString()}`);
      
    };
    const handleSearch = (search: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString()); // reset page on filter
      params.set("searchValue",search );
      router.push(`/comic/${comicId}/comicLists?${params.toString()}`);
      
    };

  return (
    <div className='flex justify-center items-center w-full'>
        <PlaylistList
         playlists={playlists}
         totalPages={paginatedData.totalPages}
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

export default ComicPlaylistsPage