import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import  {useCreatePlaylist} from "@/features/playlist/api/use-create-playlist"
import { toast } from "sonner"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useGetPlaylistsByUserWithComic } from "@/features/playlist/api/use-get-playlists-by-user-with-comic"
import { useCurrentUser } from "@/features/auth/api/use-current-user"
import { useComicId}from "@/hooks/use-comic-id"
import { useCreatePlaylistItem } from "@/features/playlist/api/use-create-playlist-item"
import { useRemovePlaylistItem } from "@/features/playlist/api/use-remove-playlist-item"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useGetNumberOfChapters } from "@/features/comic/api/use-get-comic-numberOf-chapters"
import { useGetChapters } from "@/features/chapter/api/use-get-chapters"  
import ChapterList from "@/features/chapter/components/chapter-list"
import { HiArrowsUpDown } from 'react-icons/hi2';
import { Loader } from "lucide-react"
import ChapterCard from "@/features/chapter/components/chapterCard"
import { BiUpArrow, BiUpArrowCircle, BiUpsideDown } from "react-icons/bi"




export default function ChapterListModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
  const comicId = useComicId()
  const {data:numberOfChapters, isLoading:isLoadingNumberOfChapters} = useGetNumberOfChapters({comicId})
  const [sortOption, setSortOption] = useState<"asc" | "desc">("desc");
  const {results:comicChapters, status, loadMore} = useGetChapters({comicId, sortOption})
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

  const toggleSortOption = () => {
      if(sortOption === "desc"){
        setSortOption("asc")
      }
      else{
        setSortOption("desc")
      }
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bars/60 backdrop-blur-lg">
        <DialogHeader>
          <div className="flex justify-center  items-center">
            <DialogTitle>Chapters</DialogTitle>
            <div className='px-4' onClick={toggleSortOption}>
              {sortOption === "desc" && <BiUpArrowCircle className='text-foreground text-2xl cursor-pointer'/>}
              {sortOption === "asc" && <BiUpArrowCircle className='text-foreground text-2xl rotate-180 cursor-pointer'/>} 
            </div>

          </div>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-4 mt-4 justify-center items-center px-4 overflow-y-scroll scollbar max-h-[300px] md:max-h-[500px] w-[290px] md:w-[200px] lg:w-[450px]'>
              {(numberOfChapters === 0 || numberOfChapters === undefined) && <p className='text-[12px] md:text-[14px] text-foreground/70 p-4 text-center'>no chapters available</p>}
              {chapters.map((chapter) => (
                <ChapterCard key={chapter._id} _id={chapter._id} title={chapter.title} views={230} likes={230} order={chapter.order} createdAt={chapter.createdAt} thumbnail={chapter.thumbnail} comicId={comicId} isSeen={chapter.isSeen} numberOfLikes={chapter.numberOfLikes}/>
              ))}
               
               <div
                className="h-1"
                ref={(el) =>{
                    if(el){
                        const observer = new IntersectionObserver(
                            ([entry])=>{
                                if(entry.isIntersecting && status === "CanLoadMore"){
                                    loadMore()
                                }
                            },
                            {threshold: 1.0}
                        )
                        observer.observe(el)
                        return () => {observer.disconnect()}
                    }
                }}
            />
            {status === "LoadingMore" && (
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                    <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gary-300 shadow-sm">
                        <Loader className="size-4 animate-spin"/>
                    </span>
                </div>
            )}
            </div>
        {/* <ChapterList chapters={chapters}  numberOfChapters={numberOfChapters} handleAddNewChapter={()=>{}} userIsCreator={false} sortOption={sortOption} setSortOption={setSortOption} loadMore={loadMore} isLoadingMore={status === "LoadingMore"} canLoadMore={status === "CanLoadMore"} comicId={comicId} isModal={true}/> */}
      </DialogContent>
     
    </Dialog>
  )
}
