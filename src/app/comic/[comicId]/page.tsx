
"use client"
import React from 'react'
import { useComicId } from '@/hooks/use-comic-id'
import { useGetComicById } from '@/features/comic/api/use-get-comic-by-id'
import { Bookmark, Loader, PlusCircle, User } from 'lucide-react'
import GenreButton from '@/components/genre-button'
import { FaSubscript } from 'react-icons/fa'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MdPlaylistAdd } from 'react-icons/md'
import { RiUserFollowLine } from "react-icons/ri";
import { HiArrowsUpDown } from "react-icons/hi2";
import { useGetAllComics } from '@/features/comic/api/use-get-all-comics'
import ComicGridRow from '@/features/comic/components/comic-grid-row'
import { useState } from 'react'
import AddToPlaylistModal from './add-to-playlist'
import { useCurrentUser } from '@/features/auth/api/use-current-user'
import { useIsSubscribedByUser } from '@/features/subscription/api/use-is-subscribed-by-user'
import { useCreateSubscription } from '@/features/subscription/api/use-create-subscription'
import { useRemoveSubscription } from '@/features/subscription/api/use-remove-subscription'
import { useGetPlaylistsByComicId } from '@/features/playlist/api/use-get-playlists-by-comic'
import PlaylistGridRow from '@/features/playlist/components/playlist-grid-row'
import { useGetNumberOfChapters } from '@/features/comic/api/use-get-comic-numberOf-chapters'
import { useGetViews } from '@/features/comic/api/use-get-comic-views'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play } from 'next/font/google'
import ChapterCard from '@/features/chapter/components/chapterCard'
import ComicGridRowSkeleton from '@/features/comic/components/comic-grid-row-skeleton'
import ComicPageSkeleton from './comicPage-skeleton'
import ChapterList from '@/features/chapter/components/chapter-list'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetChapters } from '@/features/chapter/api/use-get-chapters'
import { useGetNumberOfSubscriptions } from '@/features/subscription/api/use-get-number-of-subscription'
import { describe } from 'node:test'

type Chapter = {
  _id: Id<"chapters">;
  title: string;
  thumbnail: string | null;
  createdAt: number;
  likes : number;
  views: number;
  order: number;
}

const ComicPage = () => {
  const router = useRouter()
  const comicId = useComicId()
  const currentUser = useCurrentUser()
  const {data, isLoading} = useGetComicById({comicId})
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false)
  const {data:allComics, isLoading:isLoadingAllComics} = useGetAllComics()
  const {data:isComicSubscribed, isLoading:isLoadingIsComicSubscribed} = useIsSubscribedByUser({userId:currentUser?.data?._id, comicId})
  const {mutate:createSubscription, isPending:isPendingCreateSubscription} = useCreateSubscription()
  const {mutate:removeSubscription, isPending:isPendingRemoveSubscription} = useRemoveSubscription()
  const {data:playlistsWithComic, isLoading:isLoadingPlaylistsWithComic} = useGetPlaylistsByComicId({comicId})
  const {data:numberOfViews, isLoading:isLoadingNumberOfViews} = useGetViews({comicId})
  const {data:numberOfSubscriptions, isLoading:isLoadingSubscriptions} = useGetNumberOfSubscriptions({comicId})
  const {data:numberOfChapters, isLoading:isLoadingNumberOfChapters} = useGetNumberOfChapters({comicId})
  const [sortOption, setSortOption] = useState<"asc" | "desc">("desc");
  const {results:comicChapters, status, loadMore} = useGetChapters({comicId, sortOption})
  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    if (currentUser?.data) {
      if(isComicSubscribed){
        setIsSubscribed(true)
      }
      else{
        setIsSubscribed(false)
      }
    }
  }, [currentUser, comicId]);
  
    const comics = (allComics ?? []).map((comic) => ({
      _id: comic._id,
      title: comic.title,
      thumbnail: comic.thumbnail,
      views: comic.views,
      description: comic.description,
      genres: comic.genres,
       // safe fallback
    }));
    const playlists = (playlistsWithComic ?? []).map((pl) => ({
      _id: pl.playlist._id,
      title: pl.playlist.name,
      thumbnail: pl.lastComicThumbnail,
      numberOfComics: pl.numberOfComics,
    }));
    const chapters = (comicChapters ?? []).map((chapter) => ({
      _id: chapter._id,
      title: chapter.title,
      thumbnail: chapter.thumbnail, // safe fallback
      createdAt: chapter._creationTime,
      likes: chapter.likes,
      views: chapter.views,
      order: chapter.order,
      isSeen: chapter.isSeen,
      numberOfLikes: chapter.numberOfLikes,
    }));
    const handleViewAllPlaylists = () => {
      router.push(`/comic/${comicId}/comicLists`)
    }
    const handlePublisher = (userId: string|undefined) => {
      if(!userId) return
      router.push(`/user/${userId}`)
    }
    const handleBookmark = () =>{
      if(data?.bookmarkChapterOrder){
        router.push(`/comic/${comicId}/ch_${data.bookmarkChapterOrder}`)
      }
    }
    const handleAddNewChapter = () => {
      if(!currentUser.data || !data) return
      if(currentUser.data?._id !== data.creatorId) return
      router.push(`/comic/${comicId}/publishChapter`)
    }
    const handleSubscribe = async () => {
      if(!currentUser.data) return
      if(isSubscribed){
        await removeSubscription({
          comicId,
        },{
          onSuccess: (data)=>{
            toast.success("comic unsubscribed")
            setIsSubscribed(false)
          },
          onError: (error)=>{
            toast.error("could not unsubscribe")
          },
        }
      )}
      else{
        await createSubscription({
          comicId,
        },{
          onSuccess: (data)=>{
            toast.success("comic subscribed")
            setIsSubscribed(true)
          },
          onError: (error)=>{
            toast.error("could not subscribe")
          },
        }
      )}
    }
  return (
    <div className='flex justify-center w-full'>
      {(isLoading) && <ComicPageSkeleton/>}
      {!isLoading && data && (
      <>
      <AddToPlaylistModal open={showAddToPlaylistModal} onOpenChange={setShowAddToPlaylistModal}/>
      <div className='flex flex-col  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl  my-4 md:my-10'>
        <div className='flex w-full flex-col md:flex-row gap-4'>
          <img src={data?.thumbnail ? data?.thumbnail : undefined} alt={"comic1"} className='object-cover  h-full rounded-3xl w-[400px] md:w-[300px] lg:w-[350px] p-4'/>
          <div className='flex flex-col px-4 gap-2  '>
                <p className='text-[18px] md:text-[28px] text-foreground '>{data.title}</p>
                <p className='text-[12px] md:text-[14px] text-foreground/80 '>Author: {data.author}</p>
                <div className='flex gap-2 items-center justify-start'>
                <p className='text-[12px] md:text-[14px] text-primary/70 '>Published by:</p>
                <div className='flex gap-2 items-center justify-start bg-primary rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/80' onClick={()=>handlePublisher(data.creator?._id)}>
                <div className='flex items-center gap-2'>
                    <User className='text-foreground text-[10px] md:text-[10px]'/>
                    <p className='text-[10px] md:text-[12px] text-foreground'>{data.creator?.name}</p>
                </div>
                </div>
                </div>
                <div className=' grid  grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 my-4 '>
                    {data.genres.map((genre : string) => (
                    <GenreButton key={genre} genre={genre} variant='show'/>
                    ))}
                    
                    
                </div>
                <div className='flex justify-left items-start gap-2 md:gap-4 '>
                    <div className='flex items-center ' >
                        <Eye className='text-primary text-2xl'/>
                        <span className='text-foreground text-[10px] md:text-[12px] px-1 '>{numberOfViews ?? 0}</span>
                    </div>
                    <div className='flex items-center '>
                        <RiUserFollowLine className='text-primary text-2xl'/>
                        <span className='text-foreground text-[10px] md:text-[12px] px-1'>{numberOfSubscriptions ?? 0}</span>
                    </div>
                </div>
                <p className='text-foreground text-[12px] md:text-[16px] px-1'>Description</p>
                <div className='overflow-scroll h-[200px] md:w-[700px] w-[300px] scrollbar' >
                    <p className='text-foreground/70 text-[12px] md:text-[14px] px-1'>{data.description}{data.description}{data.description}{data.description}</p>
                </div>
                <div className='flex w-full justify-baseline items-center gap-4 py-4 flex-col md:flex-row'>
                <Button onClick={handleBookmark} className='bg-primary md:w-[200px] w-full cursor-pointer'>
                  
                    {currentUser.data && <Bookmark className='text-primary-foreground'/>}
                    {currentUser.data ? "Continue reading" : "Start reading"}
                </Button>
                <Button className='bg-primary md:w-[200px] w-full cursor-pointer' onClick={() => setShowAddToPlaylistModal(true)} disabled={!currentUser.data}>
                    <MdPlaylistAdd className='text-primary-foreground'/>
                    Add to playlist
                </Button>
                {/* subscribe */}
                <Button className='bg-primary md:w-[200px] w-full cursor-pointer' disabled={!currentUser.data} onClick={handleSubscribe}>
                    <RiUserFollowLine className='text-primary-foreground'/>
                    {isSubscribed ? "subscribed" : "Subscribe"}
                    
                </Button>
                
                </div>
              </div>
        </div>
        <ChapterList chapters={chapters}  numberOfChapters={numberOfChapters} handleAddNewChapter={handleAddNewChapter} userIsCreator={currentUser.data?._id === data.creatorId} sortOption={sortOption} setSortOption={setSortOption} loadMore={loadMore} isLoadingMore={status === "LoadingMore"} canLoadMore={status === "CanLoadMore"} comicId={comicId}/>
        <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
            <p className='md:px-12 px-4  text-foreground text-l md:text-2xl text-left'>You may also like</p>
            <div className='p-1 md:p-4 flex justify-center'>
              {isLoading  && <ComicGridRowSkeleton/>}
              
                        {!isLoading && data && (
                          <ComicGridRow comics={comics}/>
                        )}
                
            </div>
        </div>
        <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
          <div className='flex justify-between items-center'>
            <p className='md:px-12 px-4  text-foreground text-l md:text-2xl text-left'>Lists with this comic</p>
            <Button className='border-1 border-primary bg-transparent text-foreground cursor-pointer' onClick={handleViewAllPlaylists}>View All</Button>
          </div>
            <div className='p-1 md:p-4 flex justify-center'>
                {/* {playlists.length === 0 && <p>no lists available</p>} */}
                {playlists && <PlaylistGridRow playlists={playlists}/>}
            </div>
        </div>

      </div>
      </>
      )}
    </div>
  )
}

export default ComicPage