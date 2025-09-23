"use client"
import ComicList from '@/features/comic/components/comic-list'
import React, { use } from 'react'
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import { Bookmark, BookmarkMinus, BookmarkPlusIcon, Loader, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useGetComics } from '@/features/comic/api/use-get-comics'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { genreEnum } from '../../../../convex/genres'
import { genres } from '@/components/genres'
import {usePlaylistId} from '@/hooks/use-playlist-id'
export type Genre = typeof genreEnum.type;
const genreEnumValues = genreEnum.type;
import { Id } from '../../../../convex/_generated/dataModel'
import { useCurrentUser } from '@/features/auth/api/use-current-user'
import { Button } from '@/components/ui/button'
import {User } from 'lucide-react'
import { useGetPlaylistById } from '@/features/playlist/api/use-get-playlist-by-id'
import { useIsSavedByUser } from '@/features/playlist/api/use-is-saved-by-user'
import { useSavePlaylist } from '@/features/playlist/api/use-save-playlist'
import ComicListSkeleton from '@/features/comic/components/comic-list-skeleton'
import { useRemovePlaylistSave } from '@/features/playlist/api/use-remove-playlist-save'
import { toast } from 'sonner'
import Link from 'next/link'

const ComicListPage= () => {
  const searchParams = useSearchParams();
  const playlistId = usePlaylistId();
  const currentUser = useCurrentUser();
  const [isSaved, setIsSaved] = useState(false);
  const {data: playlist, isLoading: isLoadingPlaylist} = useGetPlaylistById({playlistId});
  const {data:isSavedByUser, isLoading: isLoadingSavedByUser} = useIsSavedByUser({playlistId, userId: currentUser?.data?._id});
  const {mutate:removePlaylistSave, isPending: isLoadingRemovePlaylistSave} = useRemovePlaylistSave();
  const {mutate: savePlaylist, isPending: isLoadingSavePlaylist} = useSavePlaylist();
  const router = useRouter();
    const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
    const selectedSort = searchParams.get("sort") ?? "views" ;
    const searchValue = searchParams.get("searchValue") ?? "" ;
    const selectedGenres = searchParams.get("genres")?.split(",") ?? [];
    const pageSize = 2;
    const invalidGenre = selectedGenres.some((genre) => !genres.includes(genre));
    const invalidSort = selectedSort !== "views" && selectedSort !== "date" && selectedSort !== "subscriptions" && selectedSort !== "names";
    const invalidPlaylistId = playlistId === "" || playlistId === undefined;
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
    console.log("playlistId", playlistId)
    
    const {data: paginatedData, isLoading} = useGetComics({
        page: currentPage,
        pageSize: pageSize,
        searchedName: searchValue,
        genres: selectedGenres as Genre[] ?? [],
        sortBy: selectedSort as "views" | "date" | "subscriptions" | "names" ?? "views",
        playlistId: playlistId as Id<"playlists">,
    });
    // if(isLoading) return <Loader/>
    // if(!paginatedData?.comics) return <div>no data</div>
    const invalidPage = currentPage < 1 || paginatedData &&  currentPage > paginatedData?.totalPages;
    if(paginatedData?.comics.length === 0){
      
      
      // router.push(`/browse?`);
    }

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

    const handleSavePlaylist = async () => {
      if(!currentUser.data) return
      console.log("save playlist", playlistId)
      await savePlaylist({
        playlistId: playlistId,
        userId: currentUser.data._id,
      }, {
      onSuccess: (data)=>{
        toast.success("saved playlist ")
      },  
        // navigate to comic page
      onError: (error)=>{
        toast.error("could not save playlist")
      },
    })
    }
    const handleUnSavePlaylist = async () => {
      if(!currentUser.data) return
      console.log("un save playlist", playlistId)
      await removePlaylistSave({
        playlistId: playlistId,
        userId: currentUser.data._id,
      }, {
      onSuccess: (data)=>{
        toast.success("unsaved playlist ")        
      },  
        // navigate to comic page
      onError: (error)=>{
        toast.error("could not unsave playlist")
      },
    })
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
      router.push(`/comicList/${playlistId}?${params.toString()}`);
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
      router.push(`/comicList/${playlistId}?${params.toString()}`);
      
    };
    const handleSearch = (search: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString()); // reset page on filter
      params.set("searchValue",search );
      router.push(`/comicList/${playlistId}?${params.toString()}`);
      
    };

  return (
    <div className='flex justify-center items-center w-full flex-col'>
      {isLoadingPlaylist && <ComicListSkeleton/>}
      {!isLoadingPlaylist && playlist && (
          <>
          <div className='flex  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary border-1 my-4 md:my-10 relative'>
            <div className='absolute top-4 right-4 cursor-pointer'>
              {isLoadingSavedByUser || !isSavedByUser && currentUser.data && 
                <BookmarkPlusIcon className='text-primary text-6xl' onClick={handleSavePlaylist}/>
              }
              {!isLoadingSavedByUser && isSavedByUser && currentUser.data && (
                <BookmarkMinus className='text-primary text-6xl' onClick={handleUnSavePlaylist}/>
              )}
              {!currentUser.data && (
                <Bookmark className='text-primary/25 text-6xl'/>
              )}
            </div>
              {/* profile */}
              <div className='flex gap-4 w-full items-center justify-center p-8'>
                  <div className='flex flex-col gap-6'>
                      {/* personal information */}
                      <div className='flex flex-col items-center justify-center gap-4'>
                          {/* <img src="https://avatars.githubusercontent.com/u/101927351?v=4" alt="profile" className='object-cover  h-full rounded-full w-[200px] md:w-[200px] lg:w-[200px] p-2'/> */}
                          <p className='text-[14px] md:text-[28px] text-foreground text-center'>{playlist?.name}</p>
                          <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[12px] md:text-[14px] text-primary/70 '>Made by:</p>
                            <div className='flex gap-2 items-center justify-start bg-primary rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/80'>
                                <Link href={`/user/${playlist.creatorId}/account`}>
                                <div className='flex items-center gap-2'>
                                    <User className='text-foreground text-[10px] md:text-[10px]'/>
                                    <p className='text-[10px] md:text-[12px] text-foreground'>{playlist.creatorName}</p>
                                </div>
                                </Link>
                            </div>
                          </div>
                          
                      </div>
                      

                      {/* comics and followers */}
                      <div className='flex gap-8 items-center justify-center'>
                          <div className='flex flex-col gap-1'>
                              <p className='text-[12px] md:text-[14px] text-foreground text-center'>{playlist.numberOfComics}</p>
                              <p className='text-[12px] md:text-[14px] text-primary text-center'>Comics</p>
                          </div>
                          <div className='flex flex-col gap-1'>
                              <p className='text-[12px] md:text-[14px] text-forground text-center'>{playlist.numberOfSaves}</p>
                              <p className='text-[12px] md:text-[14px] text-primary text-center'>Saves</p>
                          </div>
                      </div>
                      
                      

                  </div>

              </div>
              <div>

              </div>
          </div>
          <div>
            {isLoading && <ComicListSkeleton/>}
                     {!isLoading && paginatedData  && (
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

                     )
                    }
          </div>
      </>
      ) }
      </div>
  )
}

export default ComicListPage